import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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

    return data.rows.map((row, idx) => {
        const href = "/team/" + row.id
        console.info(row.id)
        return (
        <>
            <div key={idx} mykey={row.id} className="col-lg-4 wow animate__animated animate__fadeIn" data-wow-delay=".1s">
                <div className="card-blog-1 hover-up">
                    <div className="card-image mb-20"><a href={href}><Featured src={domain + row.path} alt={row.name}/></a></div>
                    <div className="card-info">
                        <div className="row">
                            <div className="col-7"><a className="color-gray-700 text-sm" href={"/arena/" + row.arena_id}> {row.arena_name}</a></div>
                            <div className="col-5 text-end"><span className="color-gray-700 text-sm timeread">{row.pv}</span></div>
                            <a href={href}><h5 className="color-white mt-20"> {row.name}</h5></a>
                            <div className="row align-items-center mt-25">
                                <div className="col-8">
                                    <div className="box-author"><img src={domain + row.avatar} alt={row.nickname}/>
                                        <div className="author-info">
                                            <h6 className="color-gray-700">{row.nickname}</h6><span className="color-gray-700 text-sm">{row.created_at}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 text-end"><a className="readmore color-gray-500 text-sm" href="single-sidebar.html"><span>更多</span></a></div>
                    </div>
                </div>
            </div>
        </>
        )
    })
}