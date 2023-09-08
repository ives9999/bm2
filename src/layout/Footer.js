import styled from "@emotion/styled";

const Logo = styled.img`
    width: 150px;
`;

export default function Footer() {
    return (
    <>
    <footer className="footer">
      <div className="container">
        <div className="footer-1 bg-gray-850 border-gray-800">
          <div className="row">
            <div className="col-lg-8 mb-30"><a className="wow animate__animated animate__fadeInUp" href="/"><Logo className="logo-night" src="/assets/imgs/logo-wide.png" alt={process.env.REACT_APP_TITLE} /><img className="d-none logo-day" alt="GenZ" src="/assets/imgs/template/logo-day.svg" /></a>
                <p className="mb-20 mt-20 text-sm color-gray-500 wow animate__animated animate__fadeInUp">
                羽球密碼是一個針對羽球愛好者開發的平台APP，提供球友尋找臨打的球隊，並可以直接報名，解決球友羽球隊臨打的困擾。
除了球友臨打功能外，還可以查看「球館」、「球隊」的資訊內容，也提供羽球教練與教學的內容，可說是羽球球友最方便使用的APP了，請喜歡打羽毛球運動的使用者一定要下載下來使用。
                </p>
                <h6 className="color-white mb-5 wow animate__animated animate__fadeInUp">聯絡我們</h6>
                <ul className="menu-footer">
                    <li className="wow animate__animated animate__fadeInUp"><a href="/contact" className="color-gray-500" alt="聯絡我們">app@bluemobile.com.tw</a></li>
                </ul>
                <div>
                    <button className="btn btn-linear hover-up">
                        會員訂閱
                        <i className="fi-rr-arrow-small-right"></i>
                    </button>
                </div>
            </div>
            <div className="col-lg-4 mb-30">
              <h6 className="text-lg mb-30 color-white wow animate__animated animate__fadeInUp">目錄</h6>
              <div className="row">
                <div className="col-12">
                  <ul className="menu-footer">
                    <li className="wow animate__animated animate__fadeInUp"><a className="color-gray-500" href="/team">球隊</a></li>
                    <li className="wow animate__animated animate__fadeInUp"><a className="color-gray-500" href="/arena">球館</a></li>
                    <li className="wow animate__animated animate__fadeInUp"><a className="color-gray-500" href="blog-archive.html">Adventure</a></li>
                    <li className="wow animate__animated animate__fadeInUp"><a className="color-gray-500" href="blog-archive.html">Canada</a></li>
                    <li className="wow animate__animated animate__fadeInUp"><a className="color-gray-500" href="blog-archive.html">America</a></li>
                    <li className="wow animate__animated animate__fadeInUp"><a className="color-gray-500" href="blog-archive.html">Curiosity</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom border-gray-800">
            <div className="row">
              <div className="col-lg-5 text-center text-lg-start">
                <p className="text-base color-white wow animate__animated animate__fadeIn">© 羽球密碼版權所有</p>
              </div>
              <div className="col-lg-7 text-center text-lg-end">
                <div className="box-socials">
                  <div className="d-inline-block mr-30 wow animate__animated animate__fadeIn" data-wow-delay=".0s"><a className="icon-socials color-gray-500" href="https://www.youtube.com/@user-badminton-password" target="_blank" rel="noreferrer"><i className="fi fi-brands-camera"/>Youtube</a></div>
                  <div className="d-inline-block mr-30 wow animate__animated animate__fadeIn" data-wow-delay=".2s"><a className="icon-socials color-gray-500" href="https://www.facebook.com/%E7%BE%BD%E7%90%83%E5%AF%86%E7%A2%BC-317063118695869/" target="_blank" rel="noreferrer">facebook</a></div>
                  <div className="d-inline-block wow animate__animated animate__fadeIn" data-wow-delay=".4s"><a className="icon-socials color-gray-500" href="https://www.instagram.com/badmintonpassword/" target="_blank" rel="noreferrer">Instagram</a></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
    )
}