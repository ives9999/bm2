import * as React from "react";
import styled from "@emotion/styled";
import Errors from "./Errors";

const Input = ({
    containerClassName="form-group",
    inputClassName="form-control bg-gray-850 border-gray-800",
    name,
    onChange,
    placeholder,
    required=false,
    type="text",
    value,
}) => {
    const inputRef = React.useRef(null)

    return (
        <div className={containerClassName}>
            <input 
                ref={inputRef} 
                className={inputClassName}
                type={type} 
                placeholder={placeholder} 
                name={name}
                defaultValue={value}
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