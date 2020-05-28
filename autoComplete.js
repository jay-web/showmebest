const autoComplete = ({ root, renderOption, onOptionSelect, changeInputValue, fetchData }) => {

root.innerHTML = `
    <label><b> Search here ... </b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">

            </div>
        </div>
    </div>
`;

const input = root.querySelector(".input");
const dropdown = root.querySelector(".dropdown");
const resultWrapper = root.querySelector(".results");

const searchAsPerInput = async (event) => {
    const items = await fetchData(event.target.value);
    resultWrapper.innerHTML = "";
    // Iterate over return movies and render the same on html if result is available
    if (!items.length) {
        dropdown.classList.remove("is-active");
        return;
    }
    if (items.length > 0) {
        dropdown.classList.add("is-active");

        for (let item of items) {
            //   console.log(movie);
            const itemList = document.createElement("a");           // ? Create the anchor element

            itemList.classList.add("dropdown-item");            // ? add class dropdown-item in anchor element
            itemList.innerHTML = renderOption(item);
            resultWrapper.appendChild(itemList);

            itemList.addEventListener("click", () => {
                dropdown.classList.remove("is-active");
                input.value = changeInputValue(item);
                onOptionSelect(item);
            });
        }
    }

}

input.addEventListener("input", debounce(searchAsPerInput, 500));

// close the dropdown if we click outside the dropdown
document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove("is-active");
    }
});


}