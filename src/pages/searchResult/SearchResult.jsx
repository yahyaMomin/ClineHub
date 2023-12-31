import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import "./style.scss";

import { fetchdatafromapi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import Spinner from "../../components/spinner/Spinner";
import PageNotFound from "../404/PageNotFound";

const SearchResult = () => {
  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const { query } = useParams();

  const fetchInitialData = () => {
    setLoading(true);
    fetchdatafromapi(`/search/multi?query=${query}&page=${pageNum}`).then((res) => {
      setData(res);
      setLoading(false);
    });
  };

  const fetchNextPageData = () => {
    fetchdatafromapi(`/search/multi?query=${query}&page=${pageNum}`).then((res) => {
      if (res?.results) {
        setData({
          ...data,
          results: [...data?.results, ...res.results],
        });
        setPageNum((prev) => prev + 1);
      } else {
        setData(res);
      }
    });
  };

  useEffect(() => {
    setPageNum(1);
    fetchInitialData();
  }, [query]);

  return (
    <div className="searchResultsPage">
      {loading && <Spinner initial={true} />}
      {!loading && (
        <ContentWrapper>
          {data?.results?.length > 0 ? (
            <>
              <div className="pageTitle">{`Search ${
                data?.total_results > 1 ? "Results" : "Result"
              } Of '${query}'`}</div>
              <InfiniteScroll
                className="content"
                dataLength={data?.results?.length || []}
                next={fetchNextPageData}
                hasMore={pageNum <= data.total_pages}
                loader={<Spinner />}
              >
                {data?.results?.map((item, index) => {
                  if (item.mediaType === "person") return;
                  return <MovieCard key={index} data={item} fromSearch={true} />;
                })}
              </InfiniteScroll>
            </>
          ) : (
            <PageNotFound />
          )}
        </ContentWrapper>
      )}
    </div>
  );
};

export default SearchResult;
