import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
//import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import styled from "@emotion/styled";

const queryClient = new QueryClient();
const url = "http://api.sportpassword.localhost/home/team"
const domain = "http://bm.sportpassword.com"
const Featured = styled.img`
    height: 193px;
`;

export function HomeTeam2() {
    return (
        <QueryClientProvider client={queryClient}>
            <Team2 />
            {/* <ReactQueryDevtools initialIsOpen={true} /> */}
        </QueryClientProvider>
    )
}

function Team2() {
    const { isLoading, error, data } = useQuery({
        queryKey: ['repoData'], 
        queryFn: () => 
            fetch(url).then(
                (res) => res.json()
            ),
    })
    if (isLoading) return 'Loading...'
    if (error) return 'An error has occured: ' + error.message

    return (
        <>
            {data.rows.map((row) => (
            <div class="col-lg-4 wow animate__animated animate__fadeIn" data-wow-delay=".1s">
                <div class="card-blog-1 hover-up">
                <div class="card-image mb-20"><a href="/team/{data.rows[0].id}"><Featured src={domain + row.path} alt="{row.name}"/></a></div>
                <div class="card-info">
                    <div class="row">
                    <div class="col-7"><a class="color-gray-700 text-sm" href="blog-archive.html"> {row.arena_name}</a>
                    </div>
                    <div class="col-5 text-end"><span class="color-gray-700 text-sm timeread">{row.pv}</span></div>
                    </div><a href="single-sidebar.html">
                    <h5 class="color-white mt-20"> {row.name}</h5></a>
                    <div class="row align-items-center mt-25">
                    <div class="col-8">
                        <div class="box-author"><img src={domain + row.avatar} alt={row.nickname}/>
                        <div class="author-info">
                            <h6 class="color-gray-700">{row.nickname}</h6><span class="color-gray-700 text-sm">{row.created_at}</span>
                        </div>
                        </div>
                    </div>
                    <div class="col-4 text-end"><a class="readmore color-gray-500 text-sm" href="single-sidebar.html"><span>更多</span></a></div>
                    </div>
                </div>
                </div>
            </div>
            ))}
        </>
    )
}