import type { NextApiRequest, NextApiResponse } from "next";
import type { ReactNode } from "react";

type ReactFC<P = object> = React.FC<
  P & {
    children?: ReactNode;
  }
>;

type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void> | void;

type AsyncVoidFunction = () => Promise<void>;
type VoidFunction = () => void;

type HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => void;
type HandleSubmit = (e: React.FormEvent<HTMLFormElement>) => Promise<void>;

// Adicionar tipos específicos para props comuns
interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
}

interface ChildrenProps extends BaseProps {
  children: ReactNode;
}
