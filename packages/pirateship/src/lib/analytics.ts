import {
  Analytics as FSAnalytics,
  GoogleAnalyticsProvider
} from '@brandingbrand/fsengage';

import { env as projectEnv } from '@brandingbrand/fsapp';

import { CommerceTypes } from '@brandingbrand/fscommerce';

import { Platform } from 'react-native';

import DeviceInfo from 'react-native-device-info';
const version = require('../../env/env').version;

const commonConfiguration = {
  userAgent: DeviceInfo.getUserAgentSync(),
  osType: Platform.OS,
  osVersion: (Platform.Version && Platform.Version.toString()) || '',
  appName: DeviceInfo.getApplicationName(),
  appId: DeviceInfo.getBundleId(),
  appVersion: version
};

const googleAnalyticsConfiguration = {
  trackerId: projectEnv.googleAnalytics[Platform.OS],
  clientId: DeviceInfo.getUniqueId()
};

const providers = [
  new GoogleAnalyticsProvider(
    commonConfiguration,
    googleAnalyticsConfiguration
  )
];

const Analytics = new FSAnalytics(providers);
export default Analytics;

interface AnalyticsProductType {
  identifier: string;
  quantity?: number;
  name: string;
  brand?: string;
  price?: CommerceTypes.CurrencyValue;
}

export function mapProductToAnalytics(
  product: CommerceTypes.Product,
  quantity?: number
): AnalyticsProductType {
  const analyticsProduct: AnalyticsProductType = {
    identifier: product.id,
    name: product.title,
    brand: product.brand,
    price: product.price
  };

  if (quantity) {
    analyticsProduct.quantity = quantity;
  }

  return analyticsProduct;
}

// Names of screens in which automatic pageview tracking should not occur (e.g., if
// tracking is handled in a subcomponent)
export const screensToIgnore = ['ProductDetail'];
