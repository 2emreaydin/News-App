sap.ui.define([
    "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"
], (Controller,JSONModel) => {
    "use strict";

    return Controller.extend("project1.controller.Main", {
        onInit() {
        },
        onSearchNews: function () {
            const sQuery = this.byId("idSearchQuery").getValue();
            const sLang = this.byId("idSelectLang").getSelectedKey() || "tr";
            const iPageSize = parseInt(this.byId("idPageSize").getValue(), 10) || 5;

            const sParameter = {
                q: sQuery || "tesla",
                fromDate: "2025-07-26",
                sortBy: "publishedAt",
                language: sLang,
                page: 1,
                pageSize: iPageSize
            };

            $.ajax({
                url: "/catalog/news/Articles",
                data: sParameter,
                success: function (oData) {
                    const oJson = new JSONModel(oData);
                    this.getView().setModel(oJson, "news");
                }.bind(this),
                error: function (oError) {
                    console.error("News error:", oError);
                }
            });
        }

    });
});