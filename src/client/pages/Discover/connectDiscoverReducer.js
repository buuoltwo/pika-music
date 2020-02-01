/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import ConnectCompReducer from "../../../utils/connectPageReducer"
import { awaitWrapper } from "../../../utils"
import { ADD_BANNER_LIST } from "./constants"

const BEST_SEARCH_SELECTOR = {
  artist: {
    selector: data => {
      return {
        imgUrl: data.img1v1Url || data.picUrl,
        title: `艺人：${data.name}`,
        desc: `歌曲：${data.musicSize} 专辑：${data.albumSize}`,
      }
    },
  },
  mv: {
    selector: data => {
      return {
        imgUrl: data.cover,
        title: `MV：${data.name}`,
        desc: `歌手：${data.artistName} 播放量：${data.playCount}`,
      }
    },
  },
  album: {
    selector: data => {
      return {
        imgUrl: data.picUrl,
        title: `专辑：${data.name}`,
        desc: `歌手：${data.artist.name}`,
      }
    },
  },
}

const SEARCH_RESULT_SELECTOR = {
  playList: {
    desc: "歌单",
    selector: data => {
      return {
        imgUrl: data.coverImgUrl,
        title: `${data.name}`,
        desc: `${data.trackCount}首`,
      }
    },
  },
  song: {
    desc: "歌曲",
    selector: data => {
      return {
        imgUrl: data.al.picUrl,
        title: `${data.name}`,
        desc: `${data.ar[0].name} · ${data.al.name}`,
        artistId: data.ar[0].id,
        albumId: data.al.id,
      }
    },
  },
  artist: {
    desc: "艺人",
    selector: data => {
      return {
        imgUrl: data.img1v1Url || data.picUrl,
        title: `艺人：${data.name}`,
        desc: `mv:${data.mvSize}  专辑:${data.albumSize}`,
      }
    },
  },
  video: {
    desc: "视频",
    selector: data => {
      return {
        imgUrl: data.coverUrl,
        title: `${data.title}`,
        desc: `${data.creator[0].userName}`,
      }
    },
  },
  album: {
    desc: "专辑",
    selector: data => {
      return {
        imgUrl: data.picUrl,
        title: `${data.name}`,
        desc: `${data.artist.name}`,
      }
    },
  },
}

class ConnectDiscoverReducer extends ConnectCompReducer {
  requestBannerList = url => {
    return this.fetcher
      .get(url)
      .then(res => res.data.banners)
      .then(banners =>
        banners.map(banner => ({
          pic: banner.pic,
          typeTitle: banner.typeTitle,
        })),
      )
  }

  requestSearchSuggest = url => {
    return this.fetcher.get(url).then(res => res.data.result)
  }

  requestSearchBestMatch = async url => {
    const result = await this.fetcher.get(url).then(res => res.data.result)
    if (result) {
      if (result.orders?.length) {
        const type = result.orders[0]
        return BEST_SEARCH_SELECTOR[type].selector(result[type][0])
      }
    }
  }

  requestSearch = async url => {
    const result = await this.fetcher.get(url).then(res => res.data.result)
    if (result) {
      if (result.order?.length) {
        return result.order
          .map(type => {
            const typeData = SEARCH_RESULT_SELECTOR[type]
            let dataList = result[type][`${type}s`]
            if (type === "song") {
              dataList = dataList.slice(0, 5)
            }
            if (typeData) {
              return {
                type,
                title: typeData.desc,
                getDesc: typeData.selector,
                dataList,
              }
            }
            return null
          })
          .filter(r => !!r)
      }
    }
  }

  getInitialData = async store => {
    const [error, bannerList] = await awaitWrapper(this.requestBannerList)(
      "/api/banner?type=2",
    )

    if (error) {
      //  handle error in server setInitialDataToStore
      return Promise.reject(error)
    }
    store.dispatch({
      type: ADD_BANNER_LIST,
      data: bannerList,
    })
  }
}

export default new ConnectDiscoverReducer()