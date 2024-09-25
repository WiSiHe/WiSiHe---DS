<script>
</script>

<details>
  <summary>Accordion</summary>
  <div class="test">
    <p>Accordion</p>
  </div>
</details>

<style>
  details {
    margin: 1rem 0;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    height: 0;
    transition: height 1s ease;
    overflow: hidden;
  }

  details[open] {
    background-color: #f9f9f9;
    height: auto;
    height: calc-size(auto);
  }

  summary {
    font-weight: bold;
    cursor: pointer;
  }
</style>
