import { useEffect, useState } from "react";
import { Spin, Empty, Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  newsStartListLoading,
  newsStopListLoading,
  newsUpdateList,
} from "../../store/news/actions";
import { NewsListReducerInterface } from "../../store/news/model";
import { maskDate } from "../../util";
import { getService } from "../../services/apiRequest";

export default function News() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);
  const [total, setTotal] = useState(0);

  const dispatch = useDispatch();
  const newsInfo = useSelector(
    (state: { news: NewsListReducerInterface }) => state.news
  );

  useEffect(() => {
    getNews();
  }, [page, limit]);

  const getNews = async () => {
    dispatch(newsStartListLoading());

    const props = {
      url: "/news/unexpired",
      limit,
      page,
    };

    const { ok, data } = await getService(props);

    if (ok) {
      const { rows, count } = data;

      setTotal(count);

      dispatch(
        newsUpdateList(
          rows.map((item) => ({
            ...item,
            createdAt: new Date(item.created_at),
            expiresIn: new Date(item.expires_in),
          }))
        )
      );
    }
    dispatch(newsStopListLoading());
  };

  return (
    <div id="news-page">
      <Spin spinning={newsInfo.loadingList}>
        {total > 0 ? (
          <main>
            <div className="news-content">
              {newsInfo.list.map((item, index) => (
                <div className="card" key={index + ""}>
                  <p>Publicado em {maskDate(item.createdAt)}</p>
                  <h3>{item.title}</h3>
                  <span>{item.description}</span>
                </div>
              ))}
            </div>

            <Pagination
              defaultCurrent={page}
              defaultPageSize={limit}
              onChange={(e) => setPage(e)}
              onShowSizeChange={(e, f) => setLimit(f)}
              total={total}
            />
          </main>
        ) : (
          <Empty description="Esta lista está vazia." />
        )}
      </Spin>
    </div>
  );
}
