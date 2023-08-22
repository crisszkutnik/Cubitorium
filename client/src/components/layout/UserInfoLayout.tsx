import { NavLink, useLocation } from "react-router-dom";
import { DefaultLayout } from "./DefaultLayout";

interface Props {
  children: React.ReactNode;
  column?: boolean;
}

export function UserInfoLayout({ children, column }: Props) {
  const { pathname } = useLocation();

  const options = [
    {
      text: "My info",
      path: "/userinfo",
    },
    {
      text: "My solves",
      path: "/userinfo/solves",
    },
  ];

  const getExtraClasses = (path: string, index: number) => {
    let ret = "";

    if (pathname === path) {
      ret += " text-accent-primary bg-accent-primary/10";
    }

    if (index === 0) {
      ret += " rounded-t";
    } else if (index === options.length - 1) {
      ret += " rounded-b";
    }

    return ret;
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center drop-shadow rounded w-1/6 bg-white">
        {options.map(({ text, path }, index) => (
          <>
            <NavLink
              key={index}
              to={path}
              className={
                "pl-3 py-3 w-full font-semibold hover:text-accent-primary hover:bg-accent-primary/10" +
                getExtraClasses(path, index)
              }
            >
              {text}
            </NavLink>
            {index !== options.length - 1 && (
              <hr className="w-full h-px border-none bg-black/5" />
            )}
          </>
        ))}
      </div>
      <div className={"flex w-5/6 ml-4" + (column ? " flex-col" : "")}>
        {children}
      </div>
    </DefaultLayout>
  );
}
