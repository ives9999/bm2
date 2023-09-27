import Layout from '../../layout/Layout';
import Input from "../../component/form/Input";
import Password from "../../component/form/Password";

const Register = () => {
    return (
        <>
        <Layout>
        <div className="py-10 mx-auto max-w-7xl">
            <main className="isolate">
              <h2 className="text-myPrimary text-center text-4xl font-bold mb-20">註冊</h2>
            </main>
            <form>
                <div className="max-w-sm mx-auto border border-borderColor p-8 rounded-lg">
                    <Input 
                        label="Email"
                        type="email"
                        name="email"
                        value={email}
                        id="email"
                        placeholder="you@example.com"
                        isRequired={true}
                        isError={isEamilEmpty}
                        errorMsg={errorMsg}
                        onChange={handleEmail}
                        onClear={handleClearEmail}
                    />
                    <Password 
                        label="密碼"
                        name="password"
                        value={password}
                        id="password"
                        placeholder="請填密碼"
                        isRequired={true}
                        isError={isPasswordEmpty}
                        errorMsg={errorMsg}
                        onChange={handlePassword}
                        onClear={handleClearPassword}
                    />
                    
                    <a href="/member/forget_password" className="text-textTitleColor text-sm">忘記密碼？</a>

                    <button
                        type="button"
                        className="rounded-md w-full h-12 mt-8 bg-myPrimary px-5 py-1 text-sm font-semibold text-myBlack shadow-sm hover:text-myWhite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={handleSubmit}
                    >
                        登入
                    </button>

                    <div className="text-menuTextWhite text-sm mt-3">還沒有帳號，請<a className="text-myPrimary text-sm" href="/member/register">註冊</a></div>
                </div>
            </form>  
        </div>    
        </Layout>
        </>
    );
}

export default Register