import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Pagination, Image } from "react-bootstrap";
import moment from "moment";
import { API_END_POINT } from "../config";
import Cookie from "js-cookie";
const token = Cookie.get("clobberswap_access_token");

import HasRole from "../hoc/HasRole";

export default class CoverBanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      brands: [],
      activePage: 1,
      pages: 1,
      q: "",
      responseMessage: "Loading Colors...",
      eventDetail: {},
    };
  }
  componentWillMount() {
    this.fetchBanners();
  }

  componentDidMount() {
    const { match, location, history } = this.props;
    console.log(location.item);
    this.setState({ eventDetail: location.item });
  }

  fetchBanners = () => {
    axios
      .get(`${API_END_POINT}/api/show-colors`, {
        headers: { "auth-token": token },
      })
      .then((response) => {
        console.log(response);
        this.setState({
          brands: response.data.colors,
          pages: Math.ceil(response.data.colors.length / 10),
          responseMessage: "No Colors Found...",
        });
      });
  };

  // const requestParams = {
  //   "userId": userId,
  // }

  deleteBrand(brandId, index) {
    if (confirm("Are you sure you want to delete this item?")) {
      axios
        .post(`${API_END_POINT}/api/delete-color`, { color_id: brandId })
        .then((response) => {
          const brands = this.state.brands.slice();
          brands.splice(index, 1);
          this.setState({ brands });
        });
    }
  }

  handleSelect(page) {
    axios.get(`/api/area?offset=${(page - 1) * 10}`).then((response) => {
      this.setState({
        areas: response.data.items,
        activePage: page,
      });
    });
  }

  handleSearch() {
    const { q } = this.state;
    if (q.length) {
      this.setState({
        loading: true,
        brands: [],
        responseMessage: "Loading Colors...",
      });
      axios
        .get(`${API_END_POINT}/api/brands/search`, {
          params: { searchWord: this.state.q },
          headers: { "auth-token": token },
        })
        .then((response) => {
          this.setState({
            brands: response.data.searchedItems,
            loading: false,
            responseMessage: "No Brands Found...",
          });
        })
        .catch(() => {
          this.setState({
            loading: false,
            responseMessage: "No Brands Found...",
          });
        });
    }
  }

  render() {
    const { eventDetail } = this.state;
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>Post Details</h3>
            </div>
          </div>
          <div className="row content-sm-left content-md-left">
            <div
              className="col-sm-10  offset-sm-1"
              style={{ textAlign: "left" }}
            >
              <div className="row space-1">
                <div className="col-sm-4" style={{ textAlign: "left" }}>
                  <img
                    src="https://i.pinimg.com/originals/66/d9/f5/66d9f5afdc5337d3f9eac362b970c426.jpg"
                    style={{ width: "250px", height: "200px" }}
                  />
                </div>
                <div className="col-sm-4" style={{ textAlign: "left" }}>
                  <img
                    src="data:image/jpeg;base64,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"
                    style={{ width: "250px", height: "200px" }}
                  />
                </div>
                <div className="col-sm-4" style={{ textAlign: "left" }}>
                  <img
                    src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUSExMWFhUXFxcYGBgXFx4bGhoaGx8aHhofGxoaHyggGhslHRgaITEiJSkrLi8uGiAzODMuNygtLisBCgoKDg0OGxAQGy0lICYvLS0vLy0tLS01LS8tLS0tLS0tLS0tLy0tLS0tLS0tLS0tLS0tLy0tLS0tLS0tLS0tLf/AABEIALcBEwMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAGAAIDBAUBBwj/xABGEAACAQMCAwUFBQYCCQMFAAABAhEAAyESMQQFQQYiUWFxEzKBkaEjQrHR8BRScsHh8WKSBxUWM0NTgpPSorLCJDRkc7P/xAAZAQADAQEBAAAAAAAAAAAAAAABAgMABAX/xAAxEQACAgEDAgMIAgEFAQAAAAAAAQIRIQMSMUFRBBNhBRVxgZGh0fAiwVIjQrHh8RT/2gAMAwEAAhEDEQA/APTOH5ujIivotyYBJIUgQSASgz5QM+lX+E4wC2C0vOO7Db+On5ViXeI4U6lW/adGAlHvEHAiJmGBAAg+sms9+Shgq2+I+zU6ypc6WECAAsgANpxnfqcVWkKFbcSioWKlVEkkDYDoPoMT/OsJu16NK6tAl5dRrEAEwrg6Q+RvIE9ZEwccLzIFBDQdR1aiSNU+7JQqTpBkRk4kUO8ZwSsyWha0hsFlAA9mBlgW3wQoYgLJnc4jqKd0uB41RX43j/aXgeIM6l2Ld5BEiNTAKxUBixPgOhFb/B83S0lu2ttnRdM7owLDBIMxqmSQYxM96mc05S+iASvso0a1ItqB3iMAA4AmdQknbo3syvA2rR9pcVHuL3lMkFTJAeV0n3TsYOahGOxun8+f3I7dpFpeKW++qy7i4zFYkz594GQAonQQJ6aTRdwHEDSqFpYKs6iNRwMmMSfLxryJu0DJch7SOqhVUG0okKTGSMrONwcAxgz3j+bXL/eulMBdMCDqIkwBADSSpOkkgLBilXiIRi2+fQLi5Uj2g1yvKuznbLiLZuLcQudMhZJzO4G3WIEdKNuzXaVeLmLbLAmSDBP3ukCMbnM+RqsNaMhHBo3q5SpVYQ5SNKkaJjlcrprlYByuV2lTWAbXCKdXKIBhFNIqSK4RRsUiIrhFSEU0iiYZFcinkVyKIBkVyKfFciiYbFKKdFKKxjkVyKdFKKwRsVG61NFNIopgKZt12rBSlTWA5x3E8MSA1gXVidSorgbdB3pz0HhSbsxwV0AtwyAkT3e6R/lIzQi/B8RYaXuaWfSDGmRpggJkSsCOgEbExW5wXNuMuT9mO4pyzQHA0yRKiBgxnJnIwTwQ1JN1JNHZKCWUxcV2XKjuX76Ee6dRe3MHJUglfCR08Nqjscj4gN7VeKS6WUJ9paBCr7wACtG46b4PSty1zLClwZJJjJYDST7ukMY2giSfSouEuKzr9ncDFmOsosACQNUbAwYO+0nNV3k9rAXn/FXNU3VFwo4WbNzaADOghis64k7xHhVHi7y8UVPe9qttsGNQggKIjvqCzHSIJEzvXqycEoYuEXURpLAAEjzMSR5TUfGcns3UZGtpnqEUkeY1KRPw61GUG7t4YUzx1OGdz7EEldGbjMO5JGNTDRO406tJkiZFa3KeYILAtXOJC94rbVbYLNpGmCSng0wGkZA8a1F4ZuDvuEVL3DQVuLqEbEgHUSVfveZYgY6jE5bdXjW0FFRbcNbAOrSNQMtcOosZLEqYO3TFR0oKKpdf3Izky/xPANfA4ixfUKAy3AgOmCe9IGScAksPAySBVCzw54Vf2hGZ1VtaOihV95QZJ7yswOV2giNWDRInZW6jErc9pb+9AQqXVgW1W4GO6Z3IPiaxO1/NrgPcYsiEKAuo23JBDEkmViYxkacGKq4Jre1X7ybd0Njlvb9tRW/biGCllnTJAgCAYPkT1FG3CcUt1FuIZVhI/XiDigbsq6cdb03ABcTNt11Z0xhi6946hMyTv4YOOA4Y27aoTJAySSZO5yxJjynG1PED4J65Xa5TCirlKlRAcpGlSogOUq7SogobSrtKiAaRTSKfXIpgEZFcipCKbFEAyK5FPiuUTDYpV2sbtJzj9ntFlhnkCJwsyQWzIGPmRWujGxSihLsT2l9uvsrrzeDYxkiJ2AwBkSR08xJdWsxyK5FOqtzG6yIWUrI6NsfIZGfyrGJopUKt2yU5UIB0nVPxhY+VKhvXc1Mg5pwtywiOym9bIhydEpOlcFEhVIk4GRjrjc5bwicQGHsltqwXKxnYkMBDDJkeR6bVl8u4TjL/AA4ua39oFYKSoggr3SDqHeUYEgCcHrW3yHiHuQtxLqtaIhtLLrBBEMGOomDMMBkTtBMIqlgu3kk4jsujgK1y4ciT3dWB4sDIxEdJO9QcTyTiNVtluKVBAZUXSSoIjOoEgb+9IzEgxRGreg3wM0rN5XEqQQCRjxGCPgaDQVJlTgOFuW+6zm4v7ztLSZJxp2BwJY4ir1KlRFKXMOWWrwAddjIIwR038IO1Y13sjYN0OEZAgBUo+WbzHjtmTMDbStEtUua37qrFpCxIbvCDoxg6d2PlSuK5oKYOdn7XE2SwvLqRgdTd32mogN3lXMgE4BY5x7tWuK5Lw16yDaQIdUgoIL7iC0gsh1HPgTVfl9s2Q6vxY7zszK7D2iEmVABkSNz/AD3qjyXmWtmRkvMwOpWWANIaCp0sCxGF6mFWY6CMopKL6jNN5IOS6OD4kWyyWVRIOGJuKZ0r1HvuxEktgTR9bcMAykEESCNiKwuSWbN4sxsujJNuTIwCw7jiM+Onyres2VQaVEATj1Mn6mivsBiiuRT4rkUwowiuU8imkVjDaVdrlEwqVKlRAKlSpUQHKVdpUQDYppFPrkURSM1w08immmAV+Mv+ztu8E6VZoG5gTFAPaN1fiNVoW2903NMsHBPc1IoJ1KQQZ/dG2RRjz27ctqtxBhdRfYjTpPvKfeXE4IMgRuaCOI4izcZLgB0q9szpKOANkBVmKqGlsSZI8JKyaoKKXK+JuWUQ27UMNUXWz3jELAAwAdixmAP8NeqWTKjvBsQSOp646elebWuYMQJi0A2uHtgqSTlJ8Z3fE7bZp9ntE3Di46CFdw2kRpBEFt50hvAeXhSvWhHFh2N5PSKxO198rw5UW2fWQO7OOu65Bx4UOWe3rMpgKWxBAkCfKQfHf+tScR2wvi28qoxhhkg+Qn8R+NCerFIMYuzKt8r46O7ageBtrP1E0qojn3FN3gbpB6w+fkYpVw74rv8AVF9r9D0Xllu7qW8VdjqM6WGiCBq0qhYkd3ZjplRETWte5zbJAWZJ/dyIPUNEAwR45EZNYnMucralALeod1JSVO2TMEYkYkSN94zFD3uIEKGb2bBl1kowiDBHeG6iCceEZrpc0nSyBRvLNLn3NDftm2pA06XMQSy97DI8aYgHII69KHuznO+IsMUKORhdOiZKqQgYkgqYU56kCq3F3dLE25RrcIJ1ZAMsGkYLE7sQSY2FQ2O1yW7hJDanLMWJJDAjBZYBK6gCsEEeJzXJJrzLtp/YslUT1DknNRxCFtJUqYYGN/EQTjcfAg5FaFeednubhruu3db3wLpuGASAwGoau4MtkE7CROa9DrsjLciElQ1mAycUJdqO1S2j7NGBDIDrVu8pOViNwRFXO2nELoSyRIuN3x4rtHxJkfw15Bx9k2nZJ904IxIOVOPEGaotPeuaJudMvC5q1KX0knUDkAx6Zk93ejn/AEfc+R19hdKi4oARioEqCIUt1YEiPzrzL2p8Z+E/jUtq9BB2IIIMdR6UY+HUeBXqt8n0FSrynlPb2/ZTQ4W6JmWLavSZ/lRPy3tdevWy/sFTPdJYtMbmIGJxv0NCUXFWx4vdhBcax+Y9orNvAJuN0C7T/Ft8pod4/jbj++xbwXYesDA9YrKuknb4nb4L5frzrRjuDLAach56L5KsArgkgAyCPI+I6+k+IGyRXl3CsbbAqSIMyPunxHlRxy7tDbeFfu3NM+TRvoz8Y8+u9GUaAma5FcIoS4/thbZmRNaaZh5ADdCCCJjIiM+lD1rtO1tydbm2vugsV2zlMkySDJPX0rnetDuUUJHplKhLhu2q6VNxRLLqGmdyRpEBTpGdyZwPGtTk/aG3xDaQCGz6SGYRmDMCdvwqiaFaNmlSpUwoqVU+K5pYt+/cUHwBk/JZNRct51avsVQmQJGoRqHiOuPON6KAaNcrtKmAMNMcGDG/SalqpxoLqyJcCONJnfTkESOoMRHUGihQZ51wnGX0uIXs2lLKGDvOkjAKnSO60TDA9Y8gvmNpFQoYXQTuZbUIE49BMYB2rR7RlvatdF6zcfV3tGpQNIAkAnTvOZMxjrWBxbXLhW3qD3GbTiYEkwx2yZA3rk1pbpbUVgjE/ab+qFulonZiMdfeAn0rp49gMQSTkQY8epI/tVm1w9zWS6g41rJ0ztBGCp69RtvilZ4e1curbLupYkMNMaWncqJlYnYj4DNNGPQZrBLwvGM/cFgSR06YmQZgYpo4BdRNy57GQSqtMkgZ8lmceu2Kdb5NdtszWmLQSNSL7yE3F1Dwk2n8/OM1du8guMquzsHAnQ+5WJLEd6BkgHedIiTVfLRNPJgXOOvKYt39K9AXAI8opUX8u7LA2wfZXSDMFRY0xJiC66iI69dxiKVL5CfRFPMoL+e37Nu7bdFtMbhIGhd+8IYy0FpDRAmfKiBOJ4a/cDI32k6gDdK5gLOkE7AgjEdaBL/PrNu0iqsvBJkqNOetwEsxgR/XBtntb+5w1uySFKtpHuElTJGD7sYM7DMGuaOrBN213KODok5lyV2IZlKGYUFgzOPdjTqAYHLZ65JNYPHdn+KPeAbuHuhiNRk/vDr3Y3keETLrnG3EZtF4aD3k78iZYjvTKzJ+fTprDtSCilyTcQKCwhhMmQAZOxiCd4HmVjo6Msvn4mlqTSoo8p501m4lwKUuCVYNbIlZEmcltjifMeA9I5f2gsXiyq0MADpOCfScH4Hw8aAeI5n7ewS7XSVVRBWFDE9CRBAlek5MVico464biFGYMCe9Jz4mfLz8qtptpdycuQn55zIX+I1AEABYDYIA2nz1SaHO0nC6ra3RukK2PuH3T8Gkf9S1dscXbDk3A3eysdfegeWEJmouXcULouMQRbZiCvgjKuPXMz4gV3xVI53kEQfKui7TeM4c2rjW23UxPiNwZ8CCD8aiWSY/XzphTW5HwB4m6EGF3Y+Cjf47D1Ir0RyqKEWAAAI6KBt9Ky+QcCOHswcO2XJ+6Oi+o6+ZPhT+IukjAOn6t6mpSW5+haP8Vjki4ni0G7QCd2IGo+RP6+FNMxIXG+BOKG+3DxaQ/wCLxn7tXOI5vxFu+lpLhCRZGmAd1SYkeZp0hG6NpDO4PxEfSucRwqXE9k+x90j7rdMn9bzuag55z2/b4t7K6NAa2AGSSNQSc/E1m8n4p24vi7bOzKty4AGJIEXGAidoFZoyd4K1js1xjs6qpKocuW0oBuDJP03FWP8AUF0d1uJsh2+6zZPhM5+lElu9cCsitDEYn3Wj3dQ6wY/WCFX+S8QSWNpmJJk4Yk9ZgmTU2/Q3BLx17ibNxhcADldM6QJXYaSsdANvADpT+F7R3Lbi4yLc05VWLBQfuwFIONszjHWrZsXb3ButxHFywQyalIJU+8MjIifkKFi8kU6hF9Abmj13ie0V84GhfRZP/qJH0rJ4ri7tz37jN5ajHy2pcONdq0/U20Jx1gU4r1O36wK50m3Rd0lZTKADO23qfAVyxee24cGCDIPgfTwjBH41y3xAvOyIZdMMq/dHQZipDwbgx7No6/Xw/Wauo0qJN2eg8r49b1sOMHZh4H8vA1brz7kvMTYuSDI2I8R4fxDcUf2bquoZTKkSDSNUFHaAO2HBJc4g6uJK6RMASVJDaROFSMQSRvk16ARQPzvkl9zce4bhTVpS2Lo1XCSADKhYx90z9Mq8oIGcJrNwWU9o7NC63cQBgZkbfPb5S8z5aLZDhkcqULum4znvAnYT55gTFM4/kt22Qre0+01MAWCgACe87joBO/8AXNRrunSDPULMS3ie7nc7GuakiywWeEv2tYS6rkhdlUAgsGkF1AZl7xmTtj1m5xyy3oZ2cGFm2jPFwiPexiJExiYmfGi9qZa4yqekS5g9DjrPTz2qlcuqQ9tRbYmPGQF6LJxvGe8cDxpoysW6PSuy3MeEThlZrltbrkFlUrKAABVhySBpA7x3YkzmsPjucreuO62mawLiArAbuo+plaNlZg7b96F+6onO5LwC37Y1FLGzSQ+lwpGnYAQOo1dBtmivslwJjjLNwWyFvBjcUaZLojMVkHTiD5SfKevoiV8mzw/arhyoMXIIxAER0jSYiuVX/wBnOEud/wBkXn72hxPntSpsCANx9kPafWw1ESJXu5H3WIG4z898msbgOKe2FXUB4KdJ1YPX7oDDfwNehc+7Nqbf2IIIM6QTEQB3Z9Afh5Ch08kugQbLwT0Q7dYI6xjf4GvJj4KWx203Z3T1luxgzA9q6oAksDOhiFydiAvv7dPL1qP/AFUDKvqRgZUbzM7gZPQYPQ5oz/2SsQDbZlmGAMAxjGVkbD0pvE9lJAAvuAOoUb7bT/TetHS1F/FrHxNJp5vIL8WdEEMSITSIMYM5BkbFvGfjU3J2LC458lU7ZYZx5L1862rnY5iD9sDJnKQPA4BqnY4Nli2O8FkswEKWY/IYxFdmhp1g55t8lPj2+0EdAP8A2cQf5U7s8fsvDMf+ld/LFaR5VLanKiQBB9HXGdJkXCMzV3g+VIoIVWMmcDTv5GBHoYrrtEaBntXwkqt4brCPH7p9w+m6+mmrXZvkGkC9ekAQVWMk9CfLwHXeiW7y8hf3AMnrMZ90g5+PQRWeeGe591j/ABIvzzkUNxqLF24W3EDoDj5+dRFl2Mb/AMs/hTOI5a6LJKjyz9IK/hXF5fxBEgIR5vdH03oWhrBrt2w9igke83QDpVjmVl/2hWCtH2OcxsvwohPLnjvJJ8ndv/ctSLbdfuXfRfZj8RNNaFaswe0w/wDr7v8AHZj5JVfs7/8Afcb/APsuf/0aiYu/UXx/E6fyNUbfA20Z3VdLOZY6GYkzMmGzkzWsyVGgRI2j47Gsjn3K/wBoXUuL6DBGNa+Hr+B8ji8GgzLf9l/zNJp94EyNp1KOvTQfHNChrTQAJx19cC7dUjBGthB9JpgYzJOetFHaTlSXSLqNbVzhhqMHG/u7/j8M5XAciLOA922FnJW4CY8hjPSf7UxOg07P3weEtknIDA+QDED4xH637fuzHQZgDwqIMAAiIAi4VQ6fP39/1411lb90xHrv6TSKNcFL7gNzC6VfjCpKkPZg6tO+vqdqvcVx91Ry8C8y6kt6vtB3/tO9ue9IO9T8V2ce8/EaiVW6bZUrbdiNM7ghR16GpuK7OFhwnfIPDqFJZSuqGnzjFFijeywH/wBUP/ybn0ijnsxzjQdDnuMf8p8f4T18PnQRyPh2tPfLwA953XvD3TtscVpHiVmdQkec/oERQkrGR6wa5Q/2V5wLii0xyPcJ6gfdPmPqPSiC40AkzgE4EnHgOtS4G5AXtjy+ygT2ym6pDkkMAxcFSo0kkhAJwm29BFziGtnW7AoBCgZOJ0hifhkx+FE3P+BN67d4xoW0jsqbF2YaQWgxImFGcTtQlzG6l2Qrd9cCdmJ1HHwAxXPrZddB4lPmQDAsrauulve8RiZEicGs/heBDJcuF9OhTvuW6AbdDHU/AVxeFcCVCk90HvTqkeGYjHp8arW7rKShWMb6ukHGT4meua0I0a7PWexFxb3Ai21ksiqFJUSSdIaYJ0wPGRMDrisPl/N7/C8Ne4nhkhbtxmUGCAgIRYBJhhpMg7zOYFc/0acw9g6W27y8SvdKs3dYAalKiQSAZiBGcmsq7evPwti1btIPZG4r3GJkkXGiAqmCMZYH0rpcqWRVFvgPOWf6ReFNpPbNFzSNYAVQG6gBmkR50q8ruclBMyqz0+0MfE2wT8qVJ5yN5Uj03h+1ABgnXBK75x8CTO+asp2jBz7NoOcBj+C14wbvQE+UHG8/nT7PE3EnS7Dpv/KptyDuPaB2it9Uuf5D/MU1uf2eoYeoA/Fq8cTibqagHIJ3hj1jzqaxxlxSpDt16nx/qaVzaDuPXv8AXHDsCrMCp3DR+dVfbcOssGGmcd4nHwmfjXlnA3L7+41wyQe6TA8OsDFFttbo4FE1xek5LRjXPvHA7v40VrbbugVudUEHFczsqs+zZgGEaF+906z9Kq8X2oYIjrZYh9USxnukjKqB1HjWLwhItPbucQrPrBDScaRBEx4kjFP4lVuWrSK8m2jFolcGT084xR8/FtjLRb6F7lXaG9fveyKqndnCZ3A+8T41i9oOdcSt5rftXgREHTj/AKas9l+FFq6bjOW+zUTneV8fGB8/OqnPLCHiLjz4E/D+31p7tcg20+C12Ru+0t8U7GYWM7gj2gJ+n0oZ4K+zF4JAVyoIO8Rny3ol7J244bij4q/43qHuVW+7c/jP4LTShgRPJr8BeAewrXb2u5pIAY6TJ/DBq52i4wi5xHs715TaNsEB2CgMAcCc9azrSTxfA7R7JDnf79P7RHvceQc67G38FZQwa8l7kl6/dtljxN7D6QQ3kv709WrQujiEE/tV6P4Ef6KhNefftfELw1trRI+3uEwYMhLEdfM1t3ub3r3Bm0zi1xAIyJ7yjeCoOlojPxnwNLuwO7NLmXPeItBD+0Ftere3bxp0yDKjPepi894skhWt3AOuhB1Ij1lTQZ7C/bt2jcMK5uaBq1bFQ+x3J09elFPKODNy3dUGCWMEGD/vL05gxgeFCn0YcBFyPmPFXBeLpbm3Ze4o0r3mUYGG2+VQcPzLmL/8C0PUH/4vXOznBXrQ4r2j6g3DvpOonxnB23FeaWOb8Q17Sl+7pmYLnYCT+vOirXIMPg9cstxRjXZtfAOf/lUlq20Je9mCLiKwULhd+oGqfGTQ52m4viBftW7D6SbTN7qmSPZge9t7xqzzzmF+2/LbaPFu4mlx1MR16b1QU2m4sjeyR6T/AOBph5gAQCjgmY75zAn92g+/z3jbfE3rTXRpW3fdACZGkErMMZGfLINZPAdquNv3UIPtCoOwwuoZMkwMDqcwa25Go9H/ANYD91/XV/aknH6iV7+ASZVSIEf4vOgHknbLjLt60jXBpcgHAnY9R5j60R9hu0N7jGu+109y2pGkdWLTuT+6PrWs1Gyl9A4OqCpmDC/g01v8N2jv3FK21W4ANJ0q7EfFCSDQDe5kEU3XQrpfRn7ykR0kwZNZnC9p34W/qsW20uMkM0tO+ggxqX6Gdqm5q6KONdQp44Jd0q15VVRpVEUwvTELOrYSZNYPOOXOgVUbYNJfB6wZBMyM9MRIou4y3du3GvAHTrWDESmonM5GIO+TttFUua8CF1G4w9o7FlM+5bk6ABsWJM+rL4VCdbXJjKOaAAJf0woDrAPzx6bTg5EnaqnEB9roAnYnzE9Djfwoh/YrNtWJuMbkH4wDG4OZJM7+gpo4EMLJKqWVlkYnSzGdzkBQDG+aEJbuDOLXIPjiIggqGDSCsA9T0yPn16U21dl2EEmTtn5TmM1ZvFbN67b0qwYMVD5XYkY+BG/4xVvgOZ2dZuC2qBQBjuyTkyoOcwPlTObXQFFR1E7ClWm5sOdftrQnoV/OD9KVDzvQwOh+o/W1Stcklo6/lFU0uQYPlU9nJ0xJJA69TjApmLRt2uHtW1Fy+2CAVtqcnw1H7oPQDNWOA5tauFiLaJbtwSSoJ36f4jsI+m1Dnaa+W4h98MQJxgYFR8DdC8Nfx3ma2Ph3jv8AD6il8tVbMEXBc0F24xACWbSl9IkajOBjoSRJqPnXNnvOJfAxA2gbYnfrn6Vh8n5sllbwYsGcKFI93BzI9Ccz1NOvsS2TnwHkPlSyhkrF1EtXboJ3MQckiYzM+ZFWuTccsaQ0E9T8MwPCev8AOshgTAjECIn4fjnFaXLhOgsi9zcnB0ERON4GPmfGg4qgqTsLOS8T3g2djpGOm0+kA/2zGvDm6xuZGFXYHbYbz/eouTuHIBGnuvggyJySAPekH8KjvX2VQFPe1eDdIzt4jfPTxq0BZBZ2b5Jps3LZkl5BO0Bi+wznvGhfg+Tp3wL5guCPs8w4GnIfO29HPY3ifaWSSQTgEjaczvQbwNooTJE/Yj3h9ydW3hXQiBf4LkgPEcNc1sRbtKoASAThZJJMe/tvjeu9p+Sib3fKm+1o5WQCocYgicCadyBSL1sn/GD/ANVxGHTwBq72sslr9swcaSYVjjvj7oPUimowN8s7Oh7KoHkC7dMhIyRbBwWndN/OrnD9msaGuyr7TbEg4yDqwYHpXLHBRpMN3WuE/Z3PvExA0Z3G1Sck4Yrdsyr92QfsboEmOptx8ZobUayp2n7NaLdm214fZi62oochmU7AnbTUnL7SWe5cYNqbUBDCYd2z4e+PlWx2u4ZmvMQHOqyqjTbuOJDXOqIwG46zWG3AvNs6LkLg/YXp6dPZ1mjWbPZO1q9svtNepXGAe7MA5Y5FBFzs5cN0seIt9zUvuMMbHVAMmPOjzsZw7I9zUrCZI1W3XqOrqBWNd4G5rudy5BZo+yueP8Fbbg15JON4a3xF6w4ur3BpZSHllldQwOukb9KudoeWq1rgr/tSvsTGxCsYOYCk/dPdgb71S4Dl9xLgJS5AJOLVz/xrb5vwztwdpArEhpI0NI9/cRI3G4rJGMe4wLN/umBJn3xqBBBn7LO9VOH5NxDtrstYSykMUVSIH3t7YkzJwRvVq3y+6JOh/wDtv/41u8l4dhbvKVYShAlSNwdpGaNA4POuV9nby8Tau6rAAcEqpfbaACnhRH/o45M3Dm7qZSXRVULJ93UZJYDfUKvWeWXQwIRsEGSjTgelbXJeFKXASjKIMkqQJjzJrKJmwa5nwTXbIVdJaVMZI7v/AE0uA5XxXtlVBbSyIYrJ1wCCSe5B3mJ3Nadnl14QAjCJ9IPh16Vs8BacXZZWj2cFjETCjxncHpU3pJvJRajXBn8XevBlWVFoAFidRYQZ0qNMRH96zufq5uhdLHvBtQBjTsAZxgCrA4HiycrcIiCCynMb+/VzmgGs90EwNxM+Xkf168fjYPT0bgryPHUuVyAu5wPEspBRsoy7rgwYjvYGRjw+VaPC8uuKuYnQApJUafHqfMD+U1osfBR8F/L86YizkrnPWK8X/wC7V2tKl8n+SjlFswOZ9mHvMX9qgbBzMY9PICqvD9jngh7iHOoaSfIZLKPCtbjuYaTARjHVXkifIGR8KzRzMoJX2s/wMQPDLflV9PV8U44f2ElOB3/ZM/vt8Cv50quXOYsp0nWSNzpXfr92lVr8d6AuJm3Ow9+e69swBPenPXdRHpUlnsdeVYOnVuG9rpg+kZ69etGhvKOhPgRIqu3EY6/OuT3lqV0+/wCR9tARzrsrxL3C6Kp1ZMOAATvudp2qknIeKto1u5aIVnQ6lhgNwZMz97r1r0IXup/Xx/OnG/j3VkyPHfyNZe1NZPKVC7Uec3+z1nUzJeICMvSYIPeBO87EeHyiTiuKW3IVZc/GYAAkQRM5ketQ86b2V29bgLqIYCfvd0nJGqDjH6I/fvZAHwztO9e1p/zSbJlq/wA0ZhpxAGR6bZJn9edO4PmDKfLqsnT5evXx3rOV5xv5frzq1a5bxDCRZun0Rvyqr2rkyDNeKLPqBB6DT0mdvKBFXuC464pZkJEnoB1JOZ38ceXlQlw/LeJCz7K7gCRoYGDAHnuCfjWvwfE3hbYNYu6xBB0NpYRAG2D9DWg4p8hk2em9juJZ0fUZIIExHjXRzK74r8h+vjtWD2E5pCuro6nBllKg5O0560/iOapbnWwTxkZz5Ef0+NdCarkk+Tct8xullGsQWUGANiYPpiqfPeacQL/sbDop9l7TvoW++oOQR0MR4x6VintPw6sp1k5Bwp6HxMSapcf2rtte9qoc/Z6NJYASWmdORMYknrEdaNx7mNe/zzi0bQ9xCSVjTb6NdRBMneGM/PpBScw4xWt67ytqZFIS14tk+9hdMDy3oX5j2oRjqAcEaO77TSJVw42UzOkKczBiucT2qV/Zk2iCrq5l8SJjMZ39PWhvj3MHPaXml60mqzkiJGT1yYAM/MUKcv7S8Qj6D7RixJKMe8rNmN8GWGDsBTeX9rhecqygHTIhoBjcS2J3rKa4puS7hJYtqLgsBGZM5aIECYMedLN204sMfU9O4PiWLe8T3TuZE4igW72t4r3gWBVzqSdQMA6gCACAGX1BYScVAO2CLaOg6W06Ad9ON85mQN/OhG/zJ2IJuas5BONzgxnckzW1Jf4sMY9z1TkvObnEFz3lRYAIuFpOZ7wwcRt4+dZ/POecVacWQ7MWBIgxEl9MthjgAxO4ORFZvDdprHD2bajMqZ0jZgBMgD86F+a85a7cLBSCSTKzB2Aw3gB+hQk/485Mlk0+a9seMQqEZ4KKZLPiTgzMZxmOo60T9he01ziC6XiQ4Qkd58+YDYHXYzFAZ464YGknEEx06CD0gbVPyzjrlh/a21AZgytPgYzGx2H8t6EJtPJpJHqpv4nUY82P51FwPNbftE786pAzOY/qKCOP7Sh7QUBg+NW0T5QSawRxlwEMukQ2rc/y8v51WWolwJQW9oOLe2vtBduSblwR7VwMPA7p8lA3jJ3Bqt2f5vxANy4S/dtM0tcJz933yVXJM907egrCTmF4s2tgyMZKGYwwby6/rpVzgOc3bewTCuoJkRqEeMHAXEdD44k2nK7G6F/gO0F7UouKChxLKoMEblsYEg7VZ532iL3S1m42iIn7uMGF0ec5k/hQvN5wwLhtRHQ4gziDgYAimjl18xpBMCB3GP661OUlVNjKgpv9ptXDKFeb+rv/AGYypmIMbjHmfnVKz2kvKuksZExKgk+siT1rFHL7ymSGH/Qw+kRNde3cI3UETkJA+IETHnXO9DSk7pfRDqSQaX+NuvYF62C0jUAcHxOkgbyGHzNZXC8+4kqfa22CgQW0mdRiI+e3TPhFVDzZvZomQ6f8RXhjmYgg4qb/AGkvZmSCIgs3571GPh3HDinnBWWtFrkiPBcQ/f8AYXTqzIKdf4hMjbPhSqdO090ADSogRgsBSrp3an+JPdp+o1O1pJE2zB8iT8xv/SpDzy43+7sOSQMaCZnzmY9fwowbiWyO6T5qJ+cT1muG4SdupwSP108a8B+N0FmOmv35FdvqClm/xLSwS5HQNacekY8x9d6jt3+MIg2nDdDpIA8MNMj5b/MvIYbYziCfy2+tNCvmCQTv/XND3lnEEBwBcWuKYd6wrTEAlD4bycjB+Y8Kiv8AI7sk/s3Dn1VJPrII+XxoseyROfjOPmMH51wWMxtQ96ai4SXyf5NsMHheE4tcBbSCfusVgY2CjJ332qzc4bisgXUAJmTqJ+uAPhWt7PxOx8v7CnraWJkRt1gkdJ2nNTl7Q1W7pfT8h2dDAHBcSRB4r5D16jPXoRTzy28xOviQQfu6MD072P18dsBab7e0NzS+8PEdPsl+Bdq6syByQH3uIunyUgD/ACkED8Ke/I7LDSz3GHgzYHXEbCfCtNeOskkahIwc9fzp/tre4j4enlSvxvierf78jbY+gPt2U4czD3AYIy0+v6mqNzsgAZDjfqp/Oi08QvQfOoHvv0A+H63qmn7Q8V3+tCtRBW72UYZAtt4yCPxFNt9m7x2tJjzH8qIrt55wxz4EfU1w37hE6m8tj8664+P8TWWif8fUxF7NXT/yx6k/HpUo7KXY95Pr+Vbdq/cOenU6dpnqP1ip5JG7GlftDxC5a+gyjFrqDT9l7oyGtH4n+a1Cez14Y7k+TfmKKNDRPezG569Bg526+FcdBOwJ+P4zTR9pavdfQzggUfkV8fc+TL+dRnlF7/lsfQj86L9G+w8oHX12Pn0phtNPvCOsYPTwxVF7Tn1r6P8AIriB55ddH/Cc/CfwqI8I3/Kb/IaN7fCgHJ8/eMf0qwirvOPj/Sn96NcpGWm2edFI3WPVTVjguN9kZCow6hlBB/mPhR5cePdBI+IPyzUdy/AzaHnqg/QUfeSkqlDHxM4pdTN5XzOxdIBREbwIEH0MVtPwgH3FnyX6yMfOsXiuItQdSWv+2KenH3IhCAsCIGPx+HzrknUswTXxApI1YcCAAM+H5bVxrzj8pzWenGXT0J3wV/DxBp1u7cMTMDcfhEDeouLvNB3drLP7Q2MH0in+1bqp+f6/Qqulsk9SCP1k71KOH/xY/XnSycUjLcywLc7j9fOuHgkYZVf8smkAF6/SZ9Ka3FAeNQcp/wC0qqXIv9V2f+Wn+Qf+NKmftXip+IFcpb1+7DvgXb7gGJUhQIiYg9I36z0qE8UcaQCMeXyMZNZ9ll9rDq7KLbEMCTDxCzJzkZrT4W1P/DZp90qcTucR3unUVpaSxRRTbGNdIzMfGOu/SOlNW6uQTsJgCSfACpSyYKyp8QwmfT7v1povIoiGidhJAJIBONumfrSKk6q2OlfUrrqI3aDJA0kfQ+v1+FcXh7jGJjrtvWhjQQAuDuW75n1MkefnVA8XaRir3As7yOpGOmZiJ8YplJylhf8An9CSS6sj4jlpVirLJ67fDI6R4U1eWmcLk+GBG+TI+vz8b0gGAxHlB/lgfOqPNuMFm2XmSNgZ0sR0JG3l5xvtTx1Jyntj1BLTglbHjhHjCgA+EeFNPAtGSB8fCpeWXj7JCzamKiWHWf5dKum/8dv1vU5TnGVWby4NGaeXjImfgBkY8AQN80hyxYmPlifiK0blzfEesbUx7g+7j+Izn/pit5s31M9KHYrpwSDp65/rNPHDDy/X6FV7iN7ZW1HTpgoJgnoRJx1qS2FLsnfkAGYEZ8CNzQe7mwUuiHnhQAJO+R5xj8Zz61wADdgPiKiPBpgGSckS2fhHl4108CCBiPLwPpt45psPqzbX2LFptX7pAloLYmPqfTJpKBEbee4HwA9evWqqcsCkQxHkMdZzGD/QVbKrEEnxiB4R0Ex+vXNxXDv5GSl1REGuDOI9BP8ASrGd9UY8KjaP1/Woyw9BGT+FJl+gywTssTJOMZH9qZInp8ZqIhdvw6nxgb00ROR8fLFPRm0WCQASTIHSNulIAGM52iKru4HT5f0rvtdx6bmfASBHX9eFOo9wbkyz3T1jz/U/oU2FM5O+MfoVTuljlQZnEbHxzGdqY9thuoBx1zHl0in2quRXP0LN+1bGTBHiaj1WoxpAPX+keNU7odjMmfUEdfL1pAEKR3Tjwz8jjodt/pTKCrLJ7rfBe1oSNLH0GB5/qOtMYxGWPxkfhj4VWWOudoAxv8aYHA2C+oafhjE1tvYXcW/a5PdLdd8/KojxDDZSfX8/GartcuHbAEeH6NMY3J3fxEEj1PpFUhHvQu4tDiZ8Z/w+PmN4pupSTIPQHVtG4n5Vmtbuknv3TsYMfHJ3zVy2lz90+Wobjp6GnlBJXaBFyYy4BJwf8xpVPc4XOFH+b+9cqfmR7/f/ALF2SIeB5zJbQomBBMmJkz9Klv8AMk9lq9kzljpDlwFncjTE7eOKVKvQXg9KMrS6B82SVmLwvEqzbBB3vEwFE4I/KtQ8e6KjgakcMQZgjSSpEHrI+u9KlXRPwmk+UGMmsnLfPLzIGNvWohZGlT1+ZwayOb83S/bM2ydB3Bgj57+m1KlSQ8Np7nKsp1y+9Cym3Gmb/AcfcuozLoPs1GuQRGqYjedpipeKv3Lltu6m2Qw7rjqIHuzmu0q4PGaENFx2I6NOTaTK3ZfiRcsAaWCozIF1zAEY/l8K1rt/SVVVGRJJ6CfqZ8I2pUq4/FL/AF5opBvYirxnNkVbnsyNSwCGUxv4wY+FXNaknBJ6xA+VKlTa+ioQVN/qi/7YITbeSpxRfXa0BVAYhpJMiDI3p/DcQPa3GIjKqMmDAkmOnQUqVSS3Rp9v7DupjuOvTocAkghYEDDY9Mfrep7lwjr69dvDEj4UqVSeKSGtkYkGdpnPlg/zOKZeYiJJyfHx2/nSpVRZlQJcHdMmNsz0k9N9wJ86gW53mQyGXTqjbIJG4/DfHwVKqaS3br6Jh6WWHTAbefAQdqhNwfPalSpYRTVg1FVUcZv4T4Y/XnTrdwD3jAjMDr+vxpUqKwyc8Mbc4vLEyTMzJ9JzTpEyQB5+UT4UqVM1ixVJtivNodQTHWYmBiI+Y+dUObto+1JJUEEnqJOTBO2TtmlSp1GtRR6XQZut3oaSWRiQI6H8xuN+lSW+DE5AjrG+fWc0qVcs9RrgtGCYjYUnPy/sBUdjQT3R1OfPqINKlWTbTfwA6uqK1mxcS9dYkNbMFZJkT5bdKuFRt9IxSpVpzcuey/4MopDgyDGf18aVKlVVHANx/9k="
                    style={{ width: "250px", height: "200px" }}
                  />
                </div>
              </div>
              <h5 style={{ textAlign: "left", marginTop: "25px" }}>
                No of likes: 0
              </h5>
              <h5 style={{ textAlign: "left" }}>No of comments: 0</h5>
              <h5 style={{ textAlign: "left" }}>
                The best and cheapest house available in this area.
                <br />
                Offering 4 beds and 5 baths
              </h5>
              <div className="commentSection">
                <div
                  className="row align-items-end comment"
                  style={{ padding: "20px", alignContent: "flex-end" }}
                >
                  <div className="col-sm-4 col-md-2">
                    <Image
                      src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
                      style={{ height: "50px", width: "50px" }}
                      roundedCircle
                    />
                  </div>
                  <div className="col-sm-8 col-md-10">
                    <p style={{ textAlign: "start" }}>Beauty at its finest</p>
                  </div>
                </div>
                <div
                  className="row align-items-end comment"
                  style={{ padding: "20px", alignContent: "flex-end" }}
                >
                  <div className="col-sm-4 col-md-2">
                    <Image
                      src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
                      style={{ height: "50px", width: "50px" }}
                      roundedCircle
                    />
                  </div>
                  <div className="col-sm-8 col-md-10">
                    <p style={{ textAlign: "start" }}>Great House</p>
                  </div>
                </div>
                <div
                  className="row align-items-end comment"
                  style={{ padding: "20px", alignContent: "flex-end" }}
                >
                  <div className="col-sm-4 col-md-2">
                    <Image
                      src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
                      style={{ height: "50px", width: "50px" }}
                      roundedCircle
                    />
                  </div>
                  <div className="col-sm-8 col-md-10">
                    <p style={{ textAlign: "start" }}>
                      Hell Yeah! The beast itself
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
