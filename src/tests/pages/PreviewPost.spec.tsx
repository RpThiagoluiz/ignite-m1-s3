import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { getPrismicClient } from "../../services/prismic";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";

const posts = {
  slug: "my-fake-post",
  title: "My new Post",
  content: "<p>Post excerpt</p>",
  updatedAt: "March, 24 - 2021",
};
//Usa o prismatic
jest.mock("../../services/prismic");
jest.mock("next-auth/client");
jest.mock("next/router");

describe("Post Preview Page", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);
    render(<Post post={posts} />);

    expect(screen.getByText("My new Post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue Reading?")).toBeInTheDocument();
  });

  it("redirects user to full post when user is subscribed", async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: "fake-active-subscription" },
      false,
    ] as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<Post post={posts} />);

    expect(pushMock).toHaveBeenCalledWith("/posts/my-fake-post");
  });

  it("loads initial data", async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "My fake post title" }],
          content: [{ type: "paragraph", text: "My fake post paragraph" }],
        },
        last_publication_date: "26-06-2021",
      }),
    } as any);

    const response = await getStaticProps({
      params: { slug: "my-new-post" },
    });

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            content: "<p>My fake post paragraph</p>",
            slug: "my-new-post",
            title: "My fake post title",
            updatedAt: "Invalid Date",
          },
        },
      })
    );
  });
});
