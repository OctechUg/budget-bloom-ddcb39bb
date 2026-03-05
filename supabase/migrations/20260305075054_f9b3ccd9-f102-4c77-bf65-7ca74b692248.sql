
-- Add savings columns to wallets
ALTER TABLE public.wallets
  ADD COLUMN IF NOT EXISTS savings_balance bigint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS savings_rate integer NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS savings_locked_until timestamptz;

-- Update the transaction insert trigger to handle savings auto-deduction from deposits
CREATE OR REPLACE FUNCTION public.handle_transaction_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _savings_rate integer;
  _savings_amount bigint;
  _net_amount bigint;
BEGIN
  -- For expenses, update the category spent_amount
  IF NEW.type = 'expense' AND NEW.category_id IS NOT NULL AND NEW.status = 'confirmed' THEN
    UPDATE public.budget_categories
    SET spent_amount = spent_amount + NEW.amount
    WHERE id = NEW.category_id AND user_id = NEW.user_id;

    PERFORM public.check_budget_alert(NEW.category_id, NEW.user_id);
  END IF;

  -- For deposits, split between wallet balance and savings
  IF NEW.type = 'deposit' AND NEW.status = 'confirmed' THEN
    SELECT savings_rate INTO _savings_rate FROM public.wallets WHERE user_id = NEW.user_id;
    _savings_rate := COALESCE(_savings_rate, 5);
    _savings_amount := (NEW.amount * _savings_rate) / 100;
    _net_amount := NEW.amount - _savings_amount;

    UPDATE public.wallets
    SET balance = balance + _net_amount,
        savings_balance = savings_balance + _savings_amount,
        total_deposited = total_deposited + NEW.amount,
        savings_locked_until = CASE
          WHEN savings_locked_until IS NULL OR savings_locked_until < now()
          THEN now() + interval '1 month'
          ELSE savings_locked_until
        END
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
$$;
