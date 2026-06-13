import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from '@/front_bff_shared/i18n';

export default getRequestConfig(async () => {
  const locale = defaultLocale;

  const [common, auth, menu, sideMenu, deptInstruction, orders, diagnosis, karte, examination, reception] =
    await Promise.all([
      import(`../../../front_bff_shared/i18n/ja.json`),
      import(`../../../front_bff_shared/i18n/features/auth.json`),
      import(`../../../front_bff_shared/i18n/features/menu.json`),
      import(`../../../front_bff_shared/i18n/features/sideMenu.json`),
      import(`../../../front_bff_shared/i18n/features/deptInstruction.json`),
      import(`../../../front_bff_shared/i18n/features/orders.json`),
      import(`../../../front_bff_shared/i18n/features/diagnosis.json`),
      import(`../../../front_bff_shared/i18n/features/karte.json`),
      import(`../../../front_bff_shared/i18n/features/examination.json`),
      import(`../../../front_bff_shared/i18n/features/reception.json`),
    ]);

  return {
    locale,
    messages: {
      common: common.default,
      auth: auth.default,
      menu: menu.default,
      sideMenu: sideMenu.default,
      deptInstruction: deptInstruction.default,
      orders: orders.default,
      diagnosis: diagnosis.default,
      karte: karte.default,
      examination: examination.default,
      reception: reception.default,
    },
  };
});
