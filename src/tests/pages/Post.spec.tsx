import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { getPrismicClient } from "../../services/prismic";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getSession } from "next-auth/client";

const posts = {
  slug: "my-fake-post",
  title: "My new Post",
  content: "<p>Post excerpt</p>",
  updatedAt: "March, 24 - 2021",
};
//Usa o prismatic
jest.mock("../../services/prismic");
jest.mock("next-auth/client");

describe("Post Page", () => {
  it("renders correctly", () => {
    render(<Post post={posts} />);

    expect(screen.getByText("My new Post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
  });

  it("redirects user if no subscription is found", async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: { slug: "my-new-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/posts/preview/my-new-post",
        }),
      })
    );
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

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-active-subscription",
    } as any);

    const response = await getServerSideProps({
      params: { slug: "my-new-post" },
    } as any);

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
