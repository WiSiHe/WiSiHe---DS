<script>
</script>

<svelte:head>
  <title>Mack Isbjørn</title>
  <meta name="description" content="Mack Isbjørn" />
  <script
    type="module"
    src="https://unpkg.com/@splinetool/viewer@1.9.5/build/spline-viewer.js"
  ></script>
</svelte:head>

<section class="grid w-full h-screen grid-cols-12 p-4 gradient-bg">
  <div class="col-span-4 p-8 mt-10 bg-white rounded h-fit">
    <div class="prose">
      <h1>Isbjørn Lite</h1>
      <p>
        Isbjørn LITE er brygget etter en metode som reduserer mengden
        karbohydrater med 70 %. Isbjørn LITE har 30 % færre kalorier enn vanlig
        pilsnerøl. Dette er et friskt øl med en tydelig humlearoma av tysk
        perlehumle. Uten restsødme er Isbjørn LITE et tørt og friskt øl, med en
        aroma av urter, te og sitrus. Isbjørn Lite er glutenfritt, og godkjent
        av Norges Cøliakiforening.
      </p>
    </div>
    <hr class="my-10" />
    <strong>Næringsinnhold per 100 ml:</strong>

    <details>
      <summary>Vis næringsinnhold</summary>
      <table class="table-auto">
        <thead>
          <tr>
            <th class="px-4 py-2">Energi</th>
            <th class="px-4 py-2">KJ</th>
            <th class="px-4 py-2">Kcal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="px-4 py-2">Energi</td>
            <td class="px-4 py-2">100</td>
            <td class="px-4 py-2">24</td>
          </tr>
          <tr>
            <td class="px-4 py-2">Fett</td>
            <td class="px-4 py-2">0</td>
            <td class="px-4 py-2">0</td>
          </tr>
          <tr>
            <td class="px-4 py-2">Karbohydrater</td>
            <td class="px-4 py-2">1,5</td>
            <td class="px-4 py-2">0,4</td>
          </tr>
          <tr>
            <td class="px-4 py-2">Protein</td>
            <td class="px-4 py-2">0,3</td>
            <td class="px-4 py-2">0,1</td>
          </tr>
        </tbody>
      </table>
    </details>
  </div>
  <div class="col-span-8">
    <spline-viewer
      url="https://prod.spline.design/VeHLDRDrDnwErPUu/scene.splinecode"
    ></spline-viewer>
  </div>
</section>

<style>
  .gradient-bg {
    background: linear-gradient(
      to bottom,
      #00aaff,
      #ffffff
    ); /* Arctic blue to white */
  }
</style>
