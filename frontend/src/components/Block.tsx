import styles from "@/styles/Block.module.css";
import { ReactNode } from 'react';

interface BlockProps {
  children: ReactNode;
  className?: string;
}

const Block = ({ children, className }: BlockProps) => {
  return (
    <div className={`${styles.block} ${className || ''}`}>
      {children}
    </div>
  );
};

export default Block; 