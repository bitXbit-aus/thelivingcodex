/**
 * Support / donation configuration — the single source of truth for the
 * Stripe Payment Links used on /support/.
 *
 * These Payment Links are LIVE (`livemode: true`). Change a URL or an amount
 * here and it changes everywhere on the site; nothing else hardcodes them.
 *
 * There is no server code behind these links. A Payment Link collects the
 * contribution entirely on Stripe's own hosted page, so the static export
 * needs no runtime, no Netlify Function and no secret key.
 */

export type SupportCadence = "one-off" | "monthly";

/** The Stripe objects each link resolves to, recorded so they can be re-found. */
export interface StripeObjectRefs {
  /** Stripe product id. */
  readonly productId: string;
  /** Stripe price id. */
  readonly priceId: string;
  /** Stripe payment-link id. */
  readonly paymentLinkId: string;
}

export interface OneOffSupportOption {
  readonly cadence: "one-off";
  readonly url: string;
  readonly stripe: StripeObjectRefs;
  readonly amount: {
    readonly currency: "USD";
    /** The donor chooses the amount on Stripe's page. */
    readonly mode: "donor-chooses";
    readonly suggestedUsd: number;
    readonly minimumUsd: number;
    readonly maximumUsd: number;
  };
}

export interface MonthlySupportOption {
  readonly cadence: "monthly";
  readonly url: string;
  readonly stripe: StripeObjectRefs;
  readonly amount: {
    readonly currency: "USD";
    /** A fixed recurring amount, set by the price. */
    readonly mode: "fixed";
    readonly perMonthUsd: number;
  };
}

export interface SupportConfig {
  /** Who receives the contribution on Stripe. */
  readonly recipient: string;
  /** Payment provider. Stripe handles the whole transaction on its own page. */
  readonly provider: string;
  readonly oneOff: OneOffSupportOption;
  readonly monthly: MonthlySupportOption;
}

/** Payment provider for both options. Named here so the page never hardcodes it. */
export const SUPPORT_PROVIDER = "Stripe";

/** Recipient named in the Stripe account. */
export const SUPPORT_RECIPIENT = "bitXbit";

export const supportConfig: SupportConfig = {
  recipient: SUPPORT_RECIPIENT,
  provider: SUPPORT_PROVIDER,

  oneOff: {
    cadence: "one-off",
    url: "https://donate.stripe.com/7sY8wPddH4MY2jvfyTasg00",
    stripe: {
      productId: "prod_VTJoBPLc0v14VP",
      priceId: "price_1USNBIFiYRdS0zBrKLl6F2Ft",
      paymentLinkId: "plink_1USNBNFiYRdS0zBrqza9QvD8",
    },
    amount: {
      currency: "USD",
      mode: "donor-chooses",
      suggestedUsd: 5,
      minimumUsd: 1,
      maximumUsd: 10_000,
    },
  },

  monthly: {
    cadence: "monthly",
    url: "https://buy.stripe.com/28EbJ13D7dju9LX86rasg01",
    stripe: {
      productId: "prod_VTJo17SNiOoofQ",
      priceId: "price_1USNBIFiYRdS0zBrevxjXgrG",
      paymentLinkId: "plink_1USNBNFiYRdS0zBr83Qpry5n",
    },
    amount: {
      currency: "USD",
      mode: "fixed",
      perMonthUsd: 5,
    },
  },
};

/** Format a whole-dollar USD amount for display, e.g. 10000 -> "$10,000". */
export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}
