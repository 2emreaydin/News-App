sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("project1.controller.Main", {
        onInit() {
        },
        onGetNews: function () {
            $.ajax({
                url: "/catalog/news/Articles",
                data: {
                    q: "tesla",
                    fromDate: "2025-07-26",
                    sortBy: "publishedAt",
                    language: "tr",
                    page: 1,
                    pageSize: 50
                },
                success: function (oData) {
                    console.log("News data:", oData);

                    const oJson = new sap.ui.model.json.JSONModel(oData);
                    this.getView().setModel(oJson, "news");
                }.bind(this),
                error: function (oError) {
                    console.error("News error:", oError);
                }
            });
        }

    });
});