import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
//import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import styled from "@emotion/styled";

const queryClient = new QueryClient();
const url = "http://api.sportpassword.localhost/home/arena";
const domain = "http://bm.sportpassword.com";
const Featured = styled.img`
  height: 193px;
`;

export function HomeArena() {
  return (
    <QueryClientProvider client={queryClient}>
      <Arena />
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
    </QueryClientProvider>
  );
}

function Arena() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () => fetch(url).then((res) => res.json()),
  });
  if (isLoading) return "Loading...";
  if (error) return "An error has occured: " + error.message;

  return data.rows.map((row) => {
    return (
    <>
        <div
          key={row.id}
          className="col-lg-4 wow animate__animated animate__fadeIn"
          data-wow-delay=".1s"
        >
          <div className="card-blog-1 hover-up">
            <div className="card-image mb-20">
              <a href="/team/{data.rows[0].id}">
                <Featured src={domain + row.path} alt="{row.name}" />
              </a>
            </div>
            <div className="card-info">
              <div className="row">
                <div className="col-7">
                  <a
                    className="color-gray-700 text-sm"
                    href="blog-archive.html"
                  >
                    {row.city_name}
                  </a>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <a
                    className="color-gray-700 text-sm"
                    href="blog-archive.html"
                  >
                    {row.area_name}
                  </a>
                </div>
                <div className="col-5 text-end">
                  <span className="color-gray-700 text-sm timeread">
                    {row.pv}
                  </span>
                </div>
              </div>
              <a href="single-sidebar.html">
                <h5 className="color-white mt-20"> {row.name}</h5>
              </a>
              <div className="row align-items-center mt-25">
                <div className="col-8">
                  <div className="box-author">
                    <img src={domain + row.avatar} alt={row.nickname} />
                    <div className="author-info">
                      <h6 className="color-gray-700">{row.nickname}</h6>
                      <span className="color-gray-700 text-sm">
                        {row.created_at}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-4 text-end">
                  <a
                    className="readmore color-gray-500 text-sm"
                    href="single-sidebar.html"
                  >
                    <span>更多</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
})
}