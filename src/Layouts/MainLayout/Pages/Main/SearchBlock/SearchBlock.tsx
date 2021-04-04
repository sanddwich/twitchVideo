import React from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import Config from '../../../../../Config/Config'
import Error from '../Error/Error'
import Loading from '../Loading/Loading'
import './SearchBlock.scss'

interface SearchBlockProps {}

interface SearchBlockState {
  twitchToken: string
  searchString: string
  minLength: number
  searchStringError: boolean
  videoList: any[]
  videoListVisible: boolean
  likeVideo: any
  videosCount: number
  paginationCurPage: number
  likeVideoVisible: boolean
  error: boolean
  loading: boolean
}

export default class SearchBlock extends React.Component<SearchBlockProps, SearchBlockState> {
  constructor(props: SearchBlockProps) {
    super(props)
    this.state = {
      twitchToken: Config.twitchToken,
      searchString: '',
      minLength: 3,
      searchStringError: false,
      videoList: [],
      videoListVisible: false,
      videosCount: 0,
      paginationCurPage: 0,
      likeVideo: JSON.parse(localStorage.getItem('likeVideoList') || '[]'),
      likeVideoVisible: false,
      error: false,
      loading: false,
    }

    // console.log(this.state.likeVideo)
  }

  validate = (): boolean => {
    if (this.state.searchString.length < this.state.minLength) {
      return false
    } else {
      return true
    }
  }

  onchangeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ searchString: event.currentTarget.value.trim(), searchStringError: false })
  }

  clickHandler = (): void => {
    this.validate() ? this.getChannelList(this.state.searchString) : this.setState({ searchStringError: true })
  }

  getChannelList = async (channelName: string): Promise<any> => {
    this.setState({ loading: true })

    const headers = {
      Accept: 'application/vnd.twitchtv.v5+json',
      'Client-ID': 'sgfgq53fiztl1az8bb9lptkhvbckwn',
      Authorization: 'Bearer 2gbdx6oar67tqtcmt49t3wpcgycthx',
    }
    const url = 'https://api.twitch.tv/kraken/search/channels?query=' + channelName
    const response = await fetch(url, {
      method: 'GET',
      headers,
    })
    const responseResult = await response.json()

    // console.log(responseResult)

    responseResult.channels[0]
      ? this.getVideoList(responseResult.channels[0]._id)
      : this.setState({ error: true, loading: false })

    // this.setState({ channelList: responseResult.channels, channelListVisible: true })
  }

  getVideoList = async (id: number): Promise<any> => {
    const limit = Config.limitVideos
    const headers = {
      Accept: 'application/vnd.twitchtv.v5+json',
      'Client-ID': 'sgfgq53fiztl1az8bb9lptkhvbckwn',
      Authorization: 'Bearer 2gbdx6oar67tqtcmt49t3wpcgycthx',
    }
    const url =
      'https://api.twitch.tv/kraken/channels/' +
      id +
      '/videos?limit=' +
      limit +
      '&offset=' +
      this.state.paginationCurPage * Config.limitVideos
    const response = await fetch(url, {
      method: 'GET',
      headers,
    })
    const responseResult = await response.json()

    // console.log(responseResult)

    this.setState({
      videoList: responseResult.videos,
      videoListVisible: true,
      videosCount: responseResult._total,
      loading: false,
    })

    responseResult._total === 0 ? this.setState({error: true}) : this.setState({error: false})

    // console.log(this.state)
  }

  setPaginationPage = (num: number): void => {
    this.getChannelList(this.state.searchString)
    this.setState({ paginationCurPage: num })
  }

  addToLikeVideo = (idNum: number): void => {
    const video = this.state.videoList.find((video) => video._id === idNum)
    let likeVideo = this.state.likeVideo

    likeVideo = likeVideo.filter((lv: any) => lv._id !== video._id)
    likeVideo.push(video)
    this.updateLikeVideos(likeVideo)
  }

  removeFromLikeVideo = (id: number): void => {
    const video = this.state.videoList.find((video) => video._id === id)
    let likeVideo = this.state.likeVideo

    likeVideo = likeVideo.filter((lv: any) => lv._id !== video._id)
    this.updateLikeVideos(likeVideo)
  }

  updateLikeVideos = (likeVideo: any): void => {
    // console.log(likeVideo)
    localStorage.removeItem('likeVideoList')
    localStorage.setItem('likeVideoList', JSON.stringify(likeVideo))
    this.setState({ likeVideo })
  }

  toggleLikeBar = (): void => {
    const likeVideoVisible = !this.state.likeVideoVisible
    this.setState({ likeVideoVisible })
  }

  render() {
    return (
      <React.Fragment>
        <div className="likeImg">
          <img src="/img/like_mini.png" alt="" onClick={() => this.toggleLikeBar()} />
        </div>

        {this.state.likeVideoVisible ? (
          <div className="likeVideoList">
            <Container fluid className="likeVideoList__elements">
              <Row className="likeVideoList__title m-0 p-2">
                <h3>Избранное: </h3>
              </Row>
              {this.state.likeVideo.map((videoEl: any) => {
                return (
                  <React.Fragment key={videoEl._id}>
                    <Row className="d-flex justify-content-end">
                      <div className="position-relative">
                        <img
                          className="closeBtn"
                          src="/img/close.png"
                          alt=""
                          onClick={() => this.removeFromLikeVideo(videoEl._id)}
                        />
                      </div>
                    </Row>
                    <Row className="likeVideosList__element m-0">
                      <Col xs={4} className="likeVideosList__elementImg p-0 d-flex align-items-center">
                        <img className="imf-fluid" src={`${videoEl.preview.small}`} alt={`${videoEl.title}`} />
                      </Col>
                      <Col xs={8} className="likeVideosList__elementImg p-0 d-flex align-items-center">
                        <a href={`${videoEl.url}`} target="_blank">
                          <h6>{videoEl.title}</h6>
                        </a>
                      </Col>
                    </Row>
                  </React.Fragment>
                )
              })}
            </Container>
          </div>
        ) : null}

        <Container fluid className="SearchBlock">
          <Container className="SearchBlock__container p-0">
            <Row className="SearchBlock__Row m-0">
              <Col md={4} className="SearchBlock__title text-right">
                Введите наименование канала:
              </Col>
              <Col md={5} className="SearchBlock__searchLine">
                <div className="SearchBlock__formItems w-100">
                  <Form.Control
                    type="text"
                    placeholder="Наименование канала"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.onchangeHandler(event)}
                  />
                  {this.state.searchStringError ? (
                    <Form.Text className="SearchBlock__searchLineError text-danger p-1">
                      Минимальное кол-во символов: 3
                    </Form.Text>
                  ) : null}
                </div>
              </Col>
              <Col md={3} className="SearchBlock__buttonCont">
                <Button
                  variant="secondary"
                  size="sm"
                  className="SearchBlock__button"
                  onClick={() => this.clickHandler()}
                >
                  Найти
                </Button>
              </Col>
            </Row>
          </Container>
        </Container>

        
        {this.state.error ? <Error /> : null}

        {this.state.loading ? (
          <Loading />
        ) : (
          <React.Fragment>
            <Container key={this.state.paginationCurPage} className="SearchBlock__channelVideos">
              {this.state.videoListVisible
                ? this.state.videoList.map((videoEl, index) => {
                    return (
                      <Container key={index} fluid className="SearchBlock__videoEl">
                        <Row className="SearchBlock__videoElRow p-2">
                          <Col
                            md={4}
                            className="SearchBlock__videoPreview d-flex align-items-center justify-content-center"
                          >
                            <img className="img-fluid" src={`${videoEl.preview.medium}`} alt={`${videoEl.title}`} />
                          </Col>
                          <Col md={8} className="SearchBlock__videoTitle d-flex align-items-center">
                            <div className="SearchBlock__videoTitleCont">
                              <a href={`${videoEl.url}`} target="_blank" rel="noreferrer">
                                <h3>{videoEl.title}</h3>
                              </a>

                              {typeof this.state.likeVideo.find((item: any) => item._id === videoEl._id) ===
                              'undefined' ? (
                                <div className="SearchBlock__toLike d-flex">
                                  <Button
                                    variant="success"
                                    size="sm"
                                    className="SearchBlock__button m-2"
                                    onClick={() => this.addToLikeVideo(videoEl._id)}
                                  >
                                    Добавить в избранное
                                  </Button>
                                </div>
                              ) : (
                                <div className="SearchBlock__toLike d-flex">
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    className="SearchBlock__button m-2"
                                    onClick={() => this.removeFromLikeVideo(videoEl._id)}
                                  >
                                    Удалить из избранного
                                  </Button>
                                </div>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </Container>
                    )
                  })
                : null}
            </Container>

            {this.state.videoListVisible ? (
              <Container key={this.state.likeVideo} className="SearchBlock__pagination pt-3">
                <div className="SearchBlock__paginationDiv">
                  {this.state.paginationCurPage !== 0 ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="SearchBlock__button m-2"
                      onClick={() => this.setPaginationPage(this.state.paginationCurPage - 1)}
                    >
                      Назад
                    </Button>
                  ) : null}

                  {this.state.videosCount / Config.limitVideos > this.state.paginationCurPage + 1 ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="SearchBlock__button m-2"
                      onClick={() => this.setPaginationPage(this.state.paginationCurPage + 1)}
                    >
                      Вперед
                    </Button>
                  ) : null}
                </div>
              </Container>
            ) : null}
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}
