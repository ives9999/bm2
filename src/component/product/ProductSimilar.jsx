import React, { useState } from 'react'
import {
    PrimaryButton,
    PrimaryOutlineButton,
    SecondaryButton,
} from '../MyButton'
import { BlueModal } from '../Modal'
import SearchBar from '../form/searchbar/SearchBar'

const ProductSimilar = () => {
    const [toggleModalShow, setToggleModalShow] = useState(false);
    const [keyword, setKeyword] = useState('')
    const [productList, setProductList] = useState({
        isShowList: false,
        list: [],

    });
    const setResult = () => {

    }

    const handleChange = (e) => {
        setKeyword(e.target.value);
    }

    const onClear = () => {
        setKeyword('')
    }

    const addSimilar = () => {
        setToggleModalShow(true)
    }
    return (
        <>
            <div className="flex">
                <PrimaryOutlineButton
                    type="button"
                    className="ml-auto mr-4 md:mr-0"
                    onClick={addSimilar}
                >
                    新增類似商品
                </PrimaryOutlineButton>
            </div>

            {toggleModalShow ? (
                <BlueModal isModalShow={toggleModalShow}>
                    <BlueModal.Header setIsModalShow={setToggleModalShow}>
                        搜尋商品
                    </BlueModal.Header>
                    <BlueModal.Body>
                        <SearchBar
                            label='搜尋商品'
                            name='product'
                            isShowList={productList.isShowList}
                            list={productList.list}
                            handleChange={handleChange}
                            onClear={onClear}
                            setResult={setResult}
                        />
                    </BlueModal.Body>
                    <BlueModal.Footer>
                        <PrimaryButton onClick={() => setToggleModalShow(false)}>
                            關閉
                        </PrimaryButton>
                    </BlueModal.Footer>
                </BlueModal>
            ) : (
                ''
            )}
        </>
    )
}

export default ProductSimilar
