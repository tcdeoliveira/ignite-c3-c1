import Link from 'next/link';
import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={`${commonStyles.container} ${styles.header}`}>
      <div className={commonStyles.container__content}>
        <Link href="/">
          <a className={styles.header_logo}>
            <img src="/images/Logo.svg" alt="logo" />
          </a>
        </Link>
      </div>
    </header>
  );
}
