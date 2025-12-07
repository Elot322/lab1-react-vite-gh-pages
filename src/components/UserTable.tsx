import { useState, useEffect } from "react";

type Post = {
  id: number;
  title: string;
  body: string;
};

const POSTS_PER_PAGE = 10;

export default function UserTable() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Post[] = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const truncateBody = (body: string, maxLength: number = 30) => {
    if (body.length <= maxLength) return body;
    return body.substring(0, maxLength) + "...";
  };

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="user-table-container">
      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading && <p>Загрузка...</p>}

      {currentPosts.length > 0 && (
        <>
          <table
            border={1}
            style={{
              marginTop: "20px",
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Body</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.title}</td>
                  <td>{truncateBody(post.body)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <button onClick={handlePrev} disabled={currentPage === 1}>
              Назад
            </button>
            <span>
              Страница {currentPage} из {totalPages}
            </span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              Вперед
            </button>
          </div>
        </>
      )}
    </div>
  );
}
