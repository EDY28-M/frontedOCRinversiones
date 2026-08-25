import { useQuery } from '@tanstack/react-query';
import { publicProductsApi } from '../api/publicApi';

export const siteSettingsKeys = {
  public: ['public-site-settings'],
};

export function usePublicSiteSettings() {
  const { data, isLoading } = useQuery({
    queryKey: siteSettingsKeys.public,
    queryFn: () => publicProductsApi.getSiteSettings(),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    retry: 1,
  });

  return {
    logoUrl: data?.logoUrl || data?.LogoUrl || '',
    showcaseShape: data?.showcaseShape || data?.ShowcaseShape || 'gear',
    updatedAt: data?.updatedAt || data?.UpdatedAt || null,
    isLoading,
  };
}

export default usePublicSiteSettings;
