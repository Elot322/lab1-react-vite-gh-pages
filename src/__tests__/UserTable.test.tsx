import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import UserTable from "../components/UserTable";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe("UserTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders button and does not show table initially", () => {
    render(<UserTable />);
    expect(screen.getByText(/загрузить пользователей/i)).toBeInTheDocument();
    expect(screen.queryByText(/иван/i)).not.toBeInTheDocument();
  });

  test("loads users and displays them when button is clicked", async () => {
    const mockUsers = [
      {
        id: 1,
        name: "Иван Иванов",
        email: "ivan@example.com",
        phone: "+7 (999) 123-45-67",
        website: "example.com",
      },
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    });

    render(<UserTable />);
    fireEvent.click(screen.getByText(/загрузить пользователей/i));

    expect(await screen.findByText(/иван иванов/i)).toBeInTheDocument();
    expect(screen.getByText(/ivan@example.com/i)).toBeInTheDocument();
  });

  test("shows error when fetch fails", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    render(<UserTable />);
    fireEvent.click(screen.getByText(/загрузить пользователей/i));

    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
  });
});
