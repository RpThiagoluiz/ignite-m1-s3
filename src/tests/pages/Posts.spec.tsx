import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { getPrismicClient } from "../../services/prismic";
import Posts, { getStaticProps } from "../../pages/posts";

const posts = [
  {
    slug: "my-fake-post",
    title: "My new Post",
    excerpt: "Post excerpt",
    updatedAt: "March, 24 - 2021",
  },
];

//Usa o prismatic
jest.mock("../../services/prismic");

describe("Posts Page", () => {
  it("renders correctly", () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText("My new Post")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "my-fake-post",
            data: {
              title: [{ type: "heading", text: "My fake post title" }],
              content: [{ type: "paragraph", text: "My fake post paragraph" }],
              last_publication_date: "22-06-2021",
            },
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              excerpt: "My fake post paragraph",
              slug: "my-fake-post",
              title: "My fake post title",
              updateAt: "Invalid Date",
            },
          ],
        },
      })
    );
  });
});
