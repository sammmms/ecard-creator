export interface TemplateProps {
  greeting: {
    id: string;
    title: string;
    senderNameDefault: string;
    messageDefault: string;
    companyLogoUrl?: string;
    isTrial?: boolean;
    submissionsEnabled?: boolean;
    donationEnabled: boolean;
    donationMode: string;
    slug: string;
  };
  wishes: Array<{
    id: string;
    name: string | null;
    comment: string | null;
    createdAt: string;
    donationAmount: number | null;
  }>;
  paymentMethods: {
    qrisImages: Array<{ label: string; url: string }>;
    ewalletType: string | null;
    ewalletNumber: string | null;
    instructionsText: string | null;
    displayName: string | null;
  } | null;
  donationMode: string;
  isPreview?: boolean;
}
