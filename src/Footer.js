export default function Footer() {
    return (
    <>
        <footer className="footer">
      <div className="container">
        <div className="footer-1 bg-gray-850 border-gray-800">
          <div className="row">
            <div className="col-lg-4 mb-30"><a className="wow animate__animated animate__fadeInUp" href="index.html"><img className="logo-night" src="assets/imgs/template/logo.svg" alt="Genz" /><img className="d-none logo-day" alt="GenZ" src="assets/imgs/template/logo-day.svg" /></a>
              <p className="mb-20 mt-20 text-sm color-gray-500 wow animate__animated animate__fadeInUp">When an unknown prnoto sans took a galley and scrambled it to make specimen book not only five When an unknown prnoto sans took a galley and scrambled it to five centurie.</p>
              <h6 className="color-white mb-5 wow animate__animated animate__fadeInUp">Address</h6>
              <p className="text-sm color-gray-500 wow animate__animated animate__fadeInUp">123 Main Street<br/>New York, NY 10001</p>
            </div>
            <div className="col-lg-4 mb-30">
              <h6 className="text-lg mb-30 color-white wow animate__animated animate__fadeInUp">Categories</h6>
              <div className="row">
                <div className="col-6">
                  <ul className="menu-footer">
                    <li className="wow animate__animated animate__fadeInUp"><a className="color-gray-500" href="blog-archive.html">Action</a></li>
                    <li className="wow animate__animated animate__fadeInUp"><a className="color-gray-500" href="blog-archive.html">Business</a></li>
                    <li className="wow animate__animated animate__fadeInUp"><a className="color-gray-500" href="blog-archive.html">Adventure</a></li>
                    <li className="wow animate__animated animate__fadeInUp"><a className="color-gray-500" href="blog-archive.html">Canada</a></li>
                    <li className="wow animate__animated animate__fadeInUp"><a className="color-gray-500" href="blog-archive.html">America</a></li>
                    <li className="wow animate__animated animate__fadeInUp"><a className="color-gray-500" href="blog-archive.html">Curiosity</a></li>
                  </ul>
                </div>
                <div className="col-6">
                  <ul className="menu-footer">
                    <li className="wow animate__animated animate__fadeInUp"><a className="color-gray-500" href="blog-archive.html">Animal</a></li>
                    <li className="wow animate__animated animate__fadeInUp"><a className="color-gray-500" href="blog-archive.html">Dental</a></li>
                    <li className="wow animate__animated animate__fadeInUp"><a className="color-gray-500" href="blog-archive.html">Biology</a></li>
                    <li className="wow animate__animated animate__fadeInUp"><a className="color-gray-500" href="blog-archive.html">Design</a></li>
                    <li className="wow animate__animated animate__fadeInUp"><a className="color-gray-500" href="blog-archive.html">Breakfast</a></li>
                    <li className="wow animate__animated animate__fadeInUp"><a className="color-gray-500" href="blog-archive.html">Dessert</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mb-30">
              <h4 className="text-lg mb-30 color-white wow animate__animated animate__fadeInUp">Newsletter</h4>
              <p className="text-base color-gray-500 wow animate__animated animate__fadeInUp">Sign up to be first to receive the latest stories inspiring us, case studies, and industry news.</p>
              <div className="form-newsletters mt-15 wow animate__animated animate__fadeInUp">
                <form action="#">
                  <div className="form-group">
                    <input className="input-name border-gray-500" type="text" placeholder="Your name"/>
                  </div>
                  <div className="form-group">
                    <input className="input-email border-gray-500" type="email" placeholder="Emaill address"/>
                  </div>
                  <div className="form-group mt-20">
                    <button className="btn btn-linear hover-up">
                      Subscribe
                      <i className="fi-rr-arrow-small-right"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="footer-bottom border-gray-800">
            <div className="row">
              <div className="col-lg-5 text-center text-lg-start">
                <p className="text-base color-white wow animate__animated animate__fadeIn">© Created by<a className="copyright" href="http://alithemes.com" target="_blank" rel="noreferrer"> AliThemes.com</a></p>
              </div>
              <div className="col-lg-7 text-center text-lg-end">
                <div className="box-socials">
                  <div className="d-inline-block mr-30 wow animate__animated animate__fadeIn" data-wow-delay=".0s"><a className="icon-socials icon-twitter color-gray-500" href="https://twitter.com">Twitter</a></div>
                  <div className="d-inline-block mr-30 wow animate__animated animate__fadeIn" data-wow-delay=".2s"><a className="icon-socials icon-linked color-gray-500" href="https://www.linkedin.com">LinkedIn</a></div>
                  <div className="d-inline-block wow animate__animated animate__fadeIn" data-wow-delay=".4s"><a className="icon-socials icon-insta color-gray-500" href="https://www.instagram.com">Instagram</a></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>

<div className="progressCounter progressScroll hover-up hover-neon-2">
<div className="progressScroll-border">
  <div className="progressScroll-circle"><span className="progressScroll-text"><i className="fi-rr-arrow-small-up"></i></span></div>
</div>
</div>
    </>
    )
}