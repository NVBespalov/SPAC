/**
 * Created by nickbespalov on 10.07.16.
 */
const h = require('snabbdom/h');
const lSPath = 'constructorScene';
const initialState = {

};
const getPath = require('./../../../utils/objects').getPath;


module.exports = function render(subject$, state) {
    function renderArray (map) {
        if(map && map.length === 0) return [];
        return map.map(function toH (o) {
            if(typeof o === 'string') return o;
            return h(getPath(o, 'tagName'), getPath(o, 'dataObject'), renderArray(getPath(o, 'children')));
        });
    }
    return h('div', {class:{'scene-constructor': true}},[
        h('div.Grid.Grid--gutters.Grid--flexCells.u-textCenter', {style: {border: '1px solid black', height: '99.8vh'}}, [
            h('div.Grid-cell.scene-preview', [
                h('div.Grid-cell', renderArray([{tagName: 'table', dataObject: {}, children:[
                    {tagName: 'thead', dataObject:{}, children: [
                        {tagName: 'tr', dataObject:{}, children: [
                            {tagName: 'th', dataObject:{}, children: ['FFFFF']},
                            {tagName: 'th', dataObject:{}, children: ['FFFE']}
                        ]}
                    ]},
                    {tagName: 'tbody', dataObject:{}, children: []}
                ]}]))
            ]),
            h('div.Grid-cell.u-1of3.scene-properties', [
                h('div', [
                    h('div.Grid.Grid--gutters.u-textCenter')
                ])
            ])

        ])
    ]);
};