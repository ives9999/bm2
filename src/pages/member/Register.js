import Layout from '../../layout/Layout';

const Register = () => {
    return (
        <>
        <Layout />
      <div className="cover-home3">
        <div className="container">
          <div className="row">
            <div className="col-xl-10 col-lg-12 m-auto">
              <div className="text-center mt-50 pb-50">
                <h2 className="color-linear d-inline-block">歡迎回來 !</h2>
              </div>
              <div className="box-form-login pb-50">
                <div className="form-login bg-gray-850 border-gray-800 text-start">
                  <form action="#">
                    <div className="form-group">
                      <input className="form-control bg-gray-850 border-gray-800" type="text" placeholder="Email" />
                    </div>
                    <div className="form-group position-relative">
                      <input className="form-control bg-gray-850 border-gray-800 password" type="password" placeholder="密碼" /><span className="viewpass"></span>
                    </div>
                    <div className="form-group"><a className="color-white link" href="/member/forget_password">忘記密碼?</a></div>
                    <div className="form-group">
                      <input className="btn btn-linear color-gray-850 hover-up" type="submit" value="登入" />
                    </div>
                    <div className="form-group mb-0"><span>沒有帳號?</span><a className="color-linear" href="/member/register"> 註冊</a></div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        <Layout />
        </>
    );
}

export default Register