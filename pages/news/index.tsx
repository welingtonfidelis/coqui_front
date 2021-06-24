import { useEffect } from "react";
import { Spin, Empty } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  newsStartListLoading,
  newsStopListLoading,
  newsUpdateList,
} from "../../store/news/actions";
import { NewsReducerInterface } from "../../store/news/model";
import { maskDate } from "../../util";

export default function News() {
  const dispatch = useDispatch();
  const newsInfo = useSelector(
    (state: { news: NewsReducerInterface }) => state.news
  );

  const images = [
    "https://images.unsplash.com/photo-1621569901036-f3733e72d312?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1624487926326-41f8e4c0a0d3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1624059729855-4296e3f5c640?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1624472896340-08dda9938113?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1624421980204-22e40117494f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
  ];

  const data = images.map((item, index) => ({
    id: index + "",
    title: `Notícia ${index + 1}`,
    description: `Descrição da notícia blablablabla ${item}`,
    image: item,
    created_at: new Date(),
  }));

  useEffect(() => {
    getNews();
  }, []);

  const getNews = async () => {
    dispatch(newsStartListLoading());

    // const props = {
    //   url: "/users/profile",
    // };

    // const { ok, data } = await getService(props);

    // if (ok) {
    //   dispatch(
    //     userUpdateProfile({
    //       ...data,
    //       ongName: data.ong_name,
    //     })
    //   );
    // }
    //dispatch(newsStoptListLoading());

    setTimeout(() => {
      dispatch(newsUpdateList(data));

      dispatch(newsStopListLoading());
    }, 3000);
  };

  return (
    <div id="news-page">
      <Spin spinning={newsInfo.loadingList}>
        {
            newsInfo.list.length 
                ? <div className="news-content">
                    {
                        newsInfo.list.map((item) => (
                            <div className="card">
                                <p>Publicado em {maskDate(item.created_at)}</p>
                                <h3>{item.title}</h3>
                                <img src={item.image} alt="" />
                                <span>{item.description}</span>
                            </div>
                        ))
                    }
                </div>
                : <Empty description="Esta lista está vazia." />
        }
      </Spin>
    </div>
  );
}
