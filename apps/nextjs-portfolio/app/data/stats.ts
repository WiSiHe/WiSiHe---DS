export interface StatSource {
  text: string;
  url?: string;
}

export interface BusinessStats {
  conversion: {
    value: number;
    label: string;
    source: StatSource;
  };
  returns: {
    value: number;
    label: string;
    source: StatSource;
  };
  engagement: {
    value: number;
    label: string;
    source: StatSource;
  };
  preference: {
    value3D: number;
    valueVideo: number;
    source: StatSource;
  };
}

export const businessStats: BusinessStats = {
  conversion: {
    value: 94,
    label: '+94%',
    source: {
      text: 'Shopify',
      url: 'https://www.shopify.com',
    },
  },
  returns: {
    value: 40,
    label: '-40%',
    source: {
      text: 'BrandXR',
      url: 'https://www.brandxr.com',
    },
  },
  engagement: {
    value: 5,
    label: '5x Longer',
    source: {
      text: 'Cappasity',
      url: 'https://www.cappasity.com',
    },
  },
  preference: {
    value3D: 95,
    valueVideo: 5,
    source: {
      text: 'User Preference Study',
    },
  },
};
