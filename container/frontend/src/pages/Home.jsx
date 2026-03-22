import { useEffect } from 'react'

export default function Home({ posts, fetchPosts}) {

    useEffect(() => {
      fetchPosts();
    });

    return (
        <div>
            <button>Create a post</button>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>{post.body}</li>
                ))}
            </ul>
        </div>
    );
}
