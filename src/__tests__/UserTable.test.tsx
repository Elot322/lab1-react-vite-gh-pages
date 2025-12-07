import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import UserTable from "../components/UserTable";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe("UserTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("loads posts and displays first 10 posts", async () => {
    const mockPosts = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      title: `Post ${i + 1}`,
      body: `Body of post ${i + 1}`,
    }));

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockPosts,
    });

    render(<UserTable />);

    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("Post 1")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("Post 10")).toBeInTheDocument();
    });
  });

  test("displays posts 11-20 after clicking 'Вперед'", async () => {
    const mockPosts = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      title: `Post ${i + 1}`,
      body: `Body of post ${i + 1}`,
    }));

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockPosts,
    });

    render(<UserTable />);

    await waitFor(() => {
      expect(screen.getByText("Вперед")).toBeInTheDocument();
    });

    const nextButton = screen.getByText("Вперед");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("11")).toBeInTheDocument();
      expect(screen.getByText("Post 11")).toBeInTheDocument();
      expect(screen.getByText("20")).toBeInTheDocument();
      expect(screen.getByText("Post 20")).toBeInTheDocument();
    });

    // Проверяем, что посты 1-10 больше не отображаются
    expect(screen.queryByText("1")).not.toBeInTheDocument();
    expect(screen.queryByText("Post 1")).not.toBeInTheDocument();
  });

  test("shows error when fetch fails", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    render(<UserTable />);

    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
  });

  test("truncates body to 30 characters", async () => {
    const mockPosts = [
      {
        id: 1,
        title: "Test Post",
        body: "This is a very long body text that should be truncated to 30 characters",
      },
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockPosts,
    });

    render(<UserTable />);

    await waitFor(() => {
      const bodyCell = screen.getByText(/This is a very long body.../i);
      expect(bodyCell).toBeInTheDocument();
      expect(bodyCell.textContent?.length).toBeLessThanOrEqual(33); // 30 + "..."
    });
  });
});
