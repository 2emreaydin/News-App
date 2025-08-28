const cds = require("@sap/cds");
const { executeHttpRequest } = require("@sap-cloud-sdk/http-client");
const { getDestination } = require("@sap-cloud-sdk/connectivity");
const axios = require("axios");

module.exports = cds.service.impl(function () {

  // Basit hello function
  this.on("hello", (req) => {
    return `Merhaba ${req.data.name || "dünya"}`;
  });

  // NewsAPI function
  this.on("Articles", async (req) => {
    const {
      q = "d",
      fromDate = "2025-08-22",
      sortBy = "publishedAt",
      language = "tr",
      page = 1,
      pageSize = 20
    } = req.data || {};

    const params = { q, from: fromDate, sortBy, language, page, pageSize };

    try {
      let data;

      if (process.env.VCAP_SERVICES) {
        const dest = await getDestination({ destinationName: "newsapi" });
        const resp = await executeHttpRequest(dest, {
          method: "GET",
          url: "/v2/everything",
          params
        });
        data = resp.data;
      } else {
        const key = process.env.NEWSAPI_KEY;
        if (!key) return req.error(500, "NEWSAPI_KEY yok (.env dosyasına ekle).");

        const resp = await axios.get("https://newsapi.org/v2/everything", {
          params,
          headers: { "X-Api-Key": key }
        });
        data = resp.data;
      }

      if (!(data && data.status === "ok" && Array.isArray(data.articles))) {
        return req.error(502, "NewsAPI beklenmeyen yanıt döndürdü.");
      }

      const articles = data.articles.map((a) => ({
        sourceId: a?.source?.id ?? null,
        sourceName: a?.source?.name ?? "",
        author: a?.author ?? null,
        title: a?.title ?? "",
        description: a?.description ?? null,
        url: a?.url ?? "",
        urlToImage: a?.urlToImage ?? null,
        publishedAt: a?.publishedAt ?? "",
        content: a?.content ?? null
      }));
      return {
        status: data.status,
        totalResults: data.totalResults,
        articles
      };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Bilinmeyen hata";
      return req.error(502, `NewsAPI çağrısı başarısız: ${msg}`);
    }
  });

});
