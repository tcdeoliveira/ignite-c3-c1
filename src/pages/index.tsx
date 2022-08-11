import { GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Link from 'next/link';

import { FiUser, FiCalendar } from 'react-icons/fi';
import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}
interface PostPagination {
  next_page: string;
  results: Post[];
}

interface IPrismicResponse {
  page: number;
  results_per_page: number;
  results_size: number;
  total_results_size: number;
  total_pages: number;
  next_page: string | null;
  prev_page: string | null;
  results: [];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState([...postsPagination.results]);
  const [nextPostsPage, setNextPostsPage] = useState(postsPagination.next_page);
  const [next, setNext] = useState(postsPagination.next_page);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function onClickNextPosts(): Promise<void> {
    if (nextPage === null) {
      return;
    }
    const response = await fetch(nextPostsPage);
    const responseData = await response.json();
    const nextPosts = responseData.results.map((post): Post => {
      return {
        uid: post.uid,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
        first_publication_date: new Date(
          post.first_publication_date
        ).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
      };
    });
    setPosts([...posts, ...nextPosts]);
    setNextPage(responseData.next_page);
  }

  return (
    <>
      <Header />
      <section className={`${commonStyles.container} ${styles.section}`}>
        {posts.map((post: Post) => (
          <article key={post.uid} className={commonStyles.container__content}>
            <Link href={`post/${post.uid}`}>
              <a>
                <h3> {post.data.title} </h3>
              </a>
            </Link>
            <Link href={`post/${post.uid}`}>
              <a>
                <p>{post.data.subtitle}</p>
              </a>
            </Link>
            <div>
              <time>
                <FiCalendar /> {post.first_publication_date}
              </time>
              <span>
                <FiUser /> {post.data.author}
              </span>
            </div>
          </article>
        ))}
        <div className={commonStyles.container__content}>
          {nextPage && (
            <button
              type="button"
              onClick={onClickNextPosts}
              className={styles.load_more_posts_button}
            >
              Carregar mais posts
            </button>
          )}
        </div>
      </section>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getStaticProps = async () => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByType('posts', { pageSize: 2 });
  const posts = response.results.map((post): Post => {
    return {
      uid: post.uid,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
      first_publication_date: new Date(
        post.first_publication_date
      ).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };
  });
  const postsPagination = {
    next_page: response.next_page,
    results: posts,
  };
  return {
    props: {
      postsPagination,
    },
  };
};
