<script>
  let checkboxPosition = { top: 0, left: 0 }

  // Get the size of the container
  function getRandomPosition() {
    const container = document.querySelector('.checkbox-container')
    const maxTop = container.clientHeight - 20 // Checkbox height
    const maxLeft = container.clientWidth - 20 // Checkbox width

    const randomTop = Math.random() * maxTop
    const randomLeft = Math.random() * maxLeft

    return { top: randomTop, left: randomLeft }
  }

  // Move the checkbox to a new random position
  function moveCheckbox() {
    checkboxPosition = getRandomPosition()
  }
</script>

<div class="checkbox-container">
  <input
    type="checkbox"
    style="top: {checkboxPosition.top}px; left: {checkboxPosition.left}px;"
    on:mouseover={moveCheckbox}
  />
  <label>Check me if you can!</label>
</div>

<style>
  .checkbox-container {
    position: relative;
    width: 200px;
    height: 100px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  input {
    position: absolute;
    width: 20px;
    height: 20px;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      top 0.2s ease,
      left 0.2s ease;
  }

  label {
    margin-left: 10px;
  }
</style>
