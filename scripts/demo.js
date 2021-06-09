const data = [
    {
        a: 1,
        b: 2
    },
    {
        a: 2,
        b: 20
    },
    {
        a: 3,
        b: 23
    },
    {
        a: 4,
        b: 25
    }
];

const isSelected = (a, b) => a === b ? "selected" : "";
data.forEach(x => {
    console.log(`
    <select>
        <option ${isSelected(x.a, 1)}>1</option>
        <option ${isSelected(x.a, 2)}>2</option>
        <option ${isSelected(x.a, 3)}>3</option>
        <option ${isSelected(x.a, 4)}>4</option>
    </select>
    `);
});