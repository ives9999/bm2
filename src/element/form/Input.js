import * as React from "react";
import styled from "@emotion/styled";
import Errors from "./Errors";

const Input = ({
    className,
    containerStyle,
    inputClass,
    errors,
    inputStyle,
    name,
    onChange,
    placeholder,
    required,
    type,
    value,
    wrapperStyle,
}) => {
    const inputRef = React.useRef(null)

    const handleClick = () => {
        if (inputRef && inputRef.current) inputRef.current.focus()
    }

    return (
        <div className="form-group">
            <input 
                ref={inputRef} 
                className="form-control bg-gray-850 border-gray-800 is-invalid" 
                type={type} 
                placeholder={placeholder} 
                name={name}
                // value={value}
                onChange={onChange} 
            />
        </div>
        // <div className={className} style={wrapperStyle}>
        //         <input
        //             ref={inputRef}
        //             className={inputClass}
        //             aria-label={name}
        //             data-testid={name}
        //             tabIndex={0}
        //             type={type}
        //             name={name}
        //             onChange={onChange}
        //             placeholder={placeholder}
        //             value={value}
        //             style={inputStyle}
        //         />
        //     {errors && !value && required && (
        //         <Errors data-testid="errors">必填欄位</Errors>
        //     )}
        // </div>
    )
}

// const Input = styled(InputComponent)
// `
//     height: 65px;
//     position: relative;
//     width: 100%;

//     .container {
//         width: 100%;

//         :not(:hover) {
//             svg {
//                 color: ${({ errors, value, required }) =>
//                     errors && !value && required ? "#e80700" : "#ccc"
//                 };
//             }
//         }
//     }

//     input {
//         color: #f7f7f7;
//         width: 100%,
//         font-size: 12px;
//         border: 1px solid
//             ${({ errors, value, required }) => 
//                 errors && !value && required ? "#e80700" : "#888"
//             };
//         border-radius: 10px;
//         width: 100%;
//         transition: border, color 0.2s ease-in-out;
//         background: transparent;

//         :-webkit-autofill {
//             -webkit-text-fill-color: #fff;
//             box-shadow: 0 0 0px 1000px #222b36 inset;

//             :focus {
//                 box-shadow: 0 0 0px 1000px #266798 inset;
//             }
//         }

//         ::placeholder {
//             color: #ccc;
//         }

//         :hover {
//             border: 1px solid #ccc;
//         }

//         :focus {
//             outline: 0;
//             border: 1px solid #ccc;
//             background: #266798;
//         }
//     }
// `;

export default Input;