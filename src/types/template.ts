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
    layoutVariant?: string;
  };
  isPreview?: boolean;
}
