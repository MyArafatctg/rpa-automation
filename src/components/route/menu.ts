export interface AppMenuItem {
  title: string;
  link?: string | null;
  parentIcon?: string;
  childIcon?: string;
  subMenus?: AppMenuItem[];
}

export const extractPermittedPaths = (menuList: AppMenuItem[]): string[] => {
  const paths = new Set<string>();
  paths.add("");

  const walk = (items: AppMenuItem[]): void => {
    items.forEach((item) => {
      if (item.link && item.link !== "#") {
        const cleanPath = item.link.replace(/^\/+/, "");
        paths.add(cleanPath);
      }

      if (item.subMenus?.length) {
        walk(item.subMenus);
      }
    });
  };

  walk(menuList);

  return Array.from(paths);
};
