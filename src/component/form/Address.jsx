import React, {useEffect, useState} from 'react';
import SelectCity from "./SelectCity";
import {areas, citys} from "../../zone";
import SelectArea from "./SelectArea";
import Input from "./Input";

function Address({
    city_id = 'city_id',
    area_id = 'area_id',
    road_id = 'road',
    city_value,
    area_value,
    road_value,
    onChange,
    handleClear,
                 }) {
    // 區域選項初始值
    var initSelectedAreas = [{city: 0, id: 0, name: "無"}];
    const [cityAreas, setCityAreas] = useState(initSelectedAreas);

    // 該縣市的所有區域
    function setAreaFromCity(city) {
        //將區域的值放入selectedAreas
        let selectedAreas = initSelectedAreas;
        for (var i = 0; i < areas.length; i++) {
            const area = areas[i]
            if (parseInt(area.city) === parseInt(city)) {
                selectedAreas.push(area)
            }
        }
        setCityAreas(selectedAreas)
    }

    useEffect(() => {
        if (city_value > 0) {
            setAreaFromCity(city_value)
        }
    }, [city_value]);

    return (
        <div className='grid grid-cols-8 gap-4'>
            <div className='col-span-2'>
                <SelectCity
                    citys={citys}
                    id={city_id}
                    value={city_value || 0}
                    onChange={onChange}
                    onClear={handleClear}
                />
            </div>
            <div className='col-span-2'>
                <SelectArea
                    areas={cityAreas}
                    id={area_id}
                    value={area_value || 0}
                    onChange={onChange}
                    onClear={handleClear}
                />
            </div>
            <div className='col-span-4'>
                <Input
                    label="路名、街道巷弄等"
                    type="text"
                    name={road_id}
                    value={road_value || ''}
                    id={road_id}
                    placeholder="中正路50號6F"
                    onChange={onChange}
                    onClear={handleClear}
                />
            </div>
        </div>
    );
}

export default Address;