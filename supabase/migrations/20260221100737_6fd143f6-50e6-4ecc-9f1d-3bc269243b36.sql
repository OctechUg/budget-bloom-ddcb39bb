
-- ═══════════════════════════════════════════════════════════════
-- 1. PROFILES
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- 2. WALLETS
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance bigint NOT NULL DEFAULT 0,
  total_deposited bigint NOT NULL DEFAULT 0,
  total_withdrawn bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet"
  ON public.wallets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet"
  ON public.wallets FOR UPDATE
  USING (auth.uid() = user_id);

-- Only the system (triggers/functions) should insert wallets
CREATE POLICY "Users can insert own wallet"
  ON public.wallets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- 3. BUDGET CATEGORIES
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.budget_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  icon text NOT NULL DEFAULT 'utensils',
  allocated_amount bigint NOT NULL DEFAULT 0,
  spent_amount bigint NOT NULL DEFAULT 0,
  period_month text NOT NULL DEFAULT to_char(now(), 'YYYY-MM'),
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own categories"
  ON public.budget_categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON public.budget_categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON public.budget_categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON public.budget_categories FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_budget_categories_user_period
  ON public.budget_categories(user_id, period_month);

-- ═══════════════════════════════════════════════════════════════
-- 4. TRANSACTIONS
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES public.budget_categories(id) ON DELETE SET NULL,
  type text NOT NULL DEFAULT 'expense',
  description text NOT NULL DEFAULT '',
  amount bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX idx_transactions_user_created
  ON public.transactions(user_id, created_at DESC);

CREATE INDEX idx_transactions_category
  ON public.transactions(category_id);

-- ═══════════════════════════════════════════════════════════════
-- 5. NOTIFICATIONS
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_notifications_user_read
  ON public.notifications(user_id, read, created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- 6. TRIGGERS & FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

-- Auto-update updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at
  BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budget_categories_updated_at
  BEFORE UPDATE ON public.budget_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile and wallet on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));

  INSERT INTO public.wallets (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update budget spent_amount when expense transaction is inserted
CREATE OR REPLACE FUNCTION public.handle_transaction_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- For expenses, update the category spent_amount
  IF NEW.type = 'expense' AND NEW.category_id IS NOT NULL AND NEW.status = 'confirmed' THEN
    UPDATE public.budget_categories
    SET spent_amount = spent_amount + NEW.amount
    WHERE id = NEW.category_id AND user_id = NEW.user_id;

    -- Check if budget exceeded and create notification
    PERFORM public.check_budget_alert(NEW.category_id, NEW.user_id);
  END IF;

  -- For deposits, update wallet balance
  IF NEW.type = 'deposit' AND NEW.status = 'confirmed' THEN
    UPDATE public.wallets
    SET balance = balance + NEW.amount,
        total_deposited = total_deposited + NEW.amount
    WHERE user_id = NEW.user_id;
  END IF;

  -- For withdrawals, update wallet balance
  IF NEW.type = 'withdrawal' AND NEW.status = 'confirmed' THEN
    UPDATE public.wallets
    SET balance = balance - NEW.amount,
        total_withdrawn = total_withdrawn + NEW.amount
    WHERE user_id = NEW.user_id;
  END IF;

  -- For expenses, deduct from wallet
  IF NEW.type = 'expense' AND NEW.status = 'confirmed' THEN
    UPDATE public.wallets
    SET balance = balance - NEW.amount
    WHERE user_id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_transaction_insert
  AFTER INSERT ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.handle_transaction_insert();

-- Budget alert checker
CREATE OR REPLACE FUNCTION public.check_budget_alert(_category_id uuid, _user_id uuid)
RETURNS void AS $$
DECLARE
  _name text;
  _allocated bigint;
  _spent bigint;
  _pct numeric;
BEGIN
  SELECT name, allocated_amount, spent_amount
  INTO _name, _allocated, _spent
  FROM public.budget_categories
  WHERE id = _category_id AND user_id = _user_id;

  IF _allocated > 0 THEN
    _pct := (_spent::numeric / _allocated::numeric) * 100;

    IF _pct >= 100 THEN
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (_user_id, 'warning', _name || ' Budget Exceeded',
              'You have exceeded your ' || _name || ' budget. Spending is now blocked for this category.');
    ELSIF _pct >= 90 THEN
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (_user_id, 'warning', _name || ' Budget Critical',
              'You have used ' || round(_pct) || '% of your ' || _name || ' budget. Consider slowing down.');
    ELSIF _pct >= 75 THEN
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (_user_id, 'info', _name || ' Budget Warning',
              'You have used ' || round(_pct) || '% of your ' || _name || ' budget.');
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
