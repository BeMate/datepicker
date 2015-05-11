describe("Dates parsing and formatting", function() {
  describe('parsing dates', function() {

    it("should parse dates with the format dd/MM/yyyy", function() {
      var format = "dd/MM/yyyy";
      expect(Dates.parse("12/03/2015", format)).toEqual(new Date("03/12/2015"));
      expect(Dates.parse("02/06/2015", format)).toEqual(new Date("06/02/2015"));
    });

    it("should parse dates with the format dd-MM-yyyy", function() {
      var format = "dd-MM-yyyy";
      expect(Dates.parse("11-05-2015", format)).toEqual(new Date("05/11/2015"));
      expect(Dates.parse("02-06-2015", format)).toEqual(new Date("06/02/2015"));
    });

    it("should parse dates with the format dd.MM.yyyy", function() {
      var format = "dd.MM.yyyy";
      expect(Dates.parse("11.05.2015", format)).toEqual(new Date("05/11/2015"));
      expect(Dates.parse("02.06.2015", format)).toEqual(new Date("06/02/2015"));
    });

    it("should parse dates with the format d/MM/yyyy", function() {
      var format = "d/MM/yyyy";
      expect(Dates.parse("2/03/2015", format)).toEqual(new Date("03/02/2015"));
      expect(Dates.parse("12/11/2015", format)).toEqual(new Date("11/12/2015"));
    });

    it("should parse dates with the format d/M/yyyy", function() {
      var format = "d/M/yyyy";
      expect(Dates.parse("2/3/2015", format)).toEqual(new Date("03/02/2015"));
      expect(Dates.parse("12/11/2015", format)).toEqual(new Date("11/12/2015"));
    });

    it("should parse dates with the format d/MM/yy", function() {
      var format = "d/MM/yy";
      expect(Dates.parse("2/03/79", format)).toEqual(new Date("03/02/1979"));
      expect(Dates.parse("12/03/14", format)).toEqual(new Date("03/12/2014"));
      expect(Dates.parse("2/03/20", format)).toEqual(new Date("03/02/2020"));
    });

    it("should parse dates with the format dd MM yyyy", function() {
      var format = "dd MM yyyy";
      expect(Dates.parse("12 03 2010", format)).toEqual(new Date("03/12/2010"));
    });


    it("should parse dates with the format ddMMyyyy", function() {
      var format = "ddMMyyyy";
      expect(Dates.parse("12032015", format)).toEqual(new Date("03/12/2015"));
      expect(Dates.parse("02032015", format)).toEqual(new Date("03/02/2015"));
    });

    it("should parse dates with the format yyyyMMdd", function() {
      var format = "yyyyMMdd";
      expect(Dates.parse("20150312", format)).toEqual(new Date("03/12/2015"));
      expect(Dates.parse("20150302", format)).toEqual(new Date("03/02/2015"));
    });

    it("should parse dates with the format dd/MM/yyyy HH:mm", function() {
      var format = "dd/MM/yyyy HH:mm";
      expect(Dates.parse("12/03/2015 18:02", format)).toEqual(new Date(2015, 2, 12, 18, 02, 0, 0));
    });

    it("should parse dates with the format dd/MM/yyyy HH:mm:ss", function() {
      var format = "dd/MM/yyyy HH:mm:ss";
      expect(Dates.parse("12/03/2015 18:02:12", format)).toEqual(new Date(2015, 2, 12, 18, 02, 12, 0));
      expect(Dates.parse("12/03/2015 07:02:12", format)).toEqual(new Date(2015, 2, 12, 07, 02, 12, 0));
    });

    it("should parse dates with the format dd/MM/yyyy HH:mm:ss:SSS", function() {
      var format = "dd/MM/yyyy HH:mm:ss:SSS";
      expect(Dates.parse("12/03/2015 18:02:12:987", format)).toEqual(new Date(2015, 2, 12, 18, 02, 12, 987));
    });

    it("should parse dates with the format dd/MM/yyyy HH:mm:ss:SS", function() {
      var format = "dd/MM/yyyy HH:mm:ss:SS";
      expect(Dates.parse("12/03/2015 18:02:12:98", format)).toEqual(new Date(2015, 2, 12, 18, 02, 12, 98));
    });

    it("should parse dates with the format dd/MM/yyyy HH:mm:ss:S", function() {
      var format = "dd/MM/yyyy HH:mm:ss:S";
      expect(Dates.parse("12/03/2015 18:02:12:9", format)).toEqual(new Date(2015, 2, 12, 18, 02, 12, 9));
    });

    it("should parse dates with the format dd/MM/yyyy H:mm", function() {
      var format = "dd/MM/yyyy H:mm";
      expect(Dates.parse("12/03/2015 8:02", format)).toEqual(new Date(2015, 2, 12, 8, 02, 0, 0));
      expect(Dates.parse("12/03/2015 18:02", format)).toEqual(new Date(2015, 2, 12, 18, 02, 0, 0));
    });

    it("should parse dates with the format dd MMM yyyy", function() {
      var format = "dd MMM yyyy";
      expect(Dates.parse("12 Mar 2015", format)).toEqual(new Date("03/12/2015"));
    });

    it("should parse dates with the format MMM dd yyyy", function() {
      var format = "MMM dd yyyy";
      expect(Dates.parse("Mar 12 2015", format)).toEqual(new Date("03/12/2015"));
    });

    it("should parse dates with the format MMMM dd, yyyy", function() {
      var format = "MMMM dd, yyyy";
      expect(Dates.parse("March 12, 2015", format)).toEqual(new Date("03/12/2015"));
    });

    it("should parse dates with the format MMMM dd yyyy", function() {
      var format = "MMMM dd yyyy";
      expect(Dates.parse("March 12 2015", format)).toEqual(new Date("03/12/2015"));
    });

    it("should parse dates with the format ddMMMyyyy", function() {
      var format = "ddMMMyyyy";
      expect(Dates.parse("12Mar2015", format)).toEqual(new Date("03/12/2015"));
    });

    it("should parse dates with the format dd MMMM yyyy", function() {
      var format = "dd MMMM yyyy";
      expect(Dates.parse("12 March 2015", format)).toEqual(new Date("03/12/2015"));
    });

    it("should parse dates with the format ISO8601", function() {
      var format = "yyyy-MM-ddTHH:mm:ss.SSSZ";
      expect(Dates.parse("2010-04-14T18:02:39.123Z", format)).toEqual(new Date(2010, 3, 14, 18, 02, 39, 123));
    });


    it("should parse dates with the format ddMMMMyyyy", function() {
      var format = "ddMMMMyyyy";
      expect(Dates.parse("12March2015", format)).toEqual(new Date("03/12/2015"));
    });

    it("should parse dates with the format MMMMddyyyy", function() {
      var format = "MMMMddyyyy";
      expect(Dates.parse("March122015", format)).toEqual(new Date("03/12/2015"));
    });

    //le monde.fr: 16.04.10 | 15h11
    it("should parse dates with the format dd.MM.yy | HHhmm", function() {
      var format = "dd.MM.yy | HHhmm";
      expect(Dates.parse("14.04.10 | 18h02", format)).toEqual(new Date(2010, 3, 14, 18, 02, 0, 0));
    });

  });


  describe('formatting dates', function() {

    it("should format dates with the format dd/MM/yyyy", function() {
      expect(Dates.format(new Date("03/12/2015"), "dd/MM/yyyy")).toEqual("12/03/2015");
      expect(Dates.format(new Date("03/02/2015"), "dd/MM/yyyy")).toEqual("02/03/2015");
    });

    it("should format dates with the format d/MM/yyyy", function() {
      expect(Dates.format(new Date("03/12/2015"), "d/MM/yyyy")).toEqual("12/03/2015");
      expect(Dates.format(new Date("03/02/2015"), "d/MM/yyyy")).toEqual("2/03/2015");
    });

    it("should format dates with the format d/M/yyyy", function() {
      expect(Dates.format(new Date("03/02/2015"), "d/M/yyyy")).toEqual("2/3/2015");
      expect(Dates.format(new Date("11/12/2015"), "d/M/yyyy")).toEqual("12/11/2015");
    });

    it("should format dates with the format d/MM/yy", function() {
      expect(Dates.format(new Date("03/02/1979"), "d/MM/yy")).toEqual("2/03/79");
      expect(Dates.format(new Date("03/12/2010"), "d/MM/yy")).toEqual("12/03/10");
      expect(Dates.format(new Date("03/02/2020"), "d/MM/yy")).toEqual("2/03/20");
    });

    it("should format dates with the format dd MM yyyy", function() {
      expect(Dates.format(new Date("03/12/2010"), "dd MM yyyy")).toEqual("12 03 2010");
    });

    it("should format dates with the format dd/MM/yyyy HH:mm", function() {
      expect(Dates.format(new Date(2015, 2, 12, 18, 02, 0, 0), "dd/MM/yyyy HH:mm")).toEqual("12/03/2015 18:02");
    });

    it("should format dates with the format dd/MM/yyyy HH:mm:ss", function() {
      expect(Dates.format(new Date(2015, 2, 12, 18, 02, 12, 0), "dd/MM/yyyy HH:mm:ss")).toEqual("12/03/2015 18:02:12");
      expect(Dates.format(new Date(2015, 2, 12, 07, 02, 12, 0), "dd/MM/yyyy HH:mm:ss")).toEqual("12/03/2015 07:02:12");
    });

    it("should format dates with the format dd/MM/yyyy HH:mm:ss:SSS", function() {
      expect(Dates.format(new Date(2015, 2, 12, 18, 02, 12, 987), "dd/MM/yyyy HH:mm:ss:SSS")).toEqual("12/03/2015 18:02:12:987");
    });

    it("should format dates with the format dd/MM/yyyy HH:mm:ss:SS", function() {
      expect(Dates.format(new Date(2015, 2, 12, 18, 02, 12, 987), "dd/MM/yyyy HH:mm:ss:SS")).toEqual("12/03/2015 18:02:12:987");
    });

    it("should format dates with the format dd/MM/yyyy HH:mm:ss:S", function() {
      expect(Dates.format(new Date(2015, 2, 12, 18, 02, 12, 987), "dd/MM/yyyy HH:mm:ss:S")).toEqual("12/03/2015 18:02:12:987");
    });

    it("should format dates with the format dd MMM yyyy", function() {
      expect(Dates.format(new Date("03/12/2015"), "dd MMM yyyy")).toEqual("12 Mar 2015");
    });

    it("should format dates with the format MMMM dd, yyyy", function() {
      expect(Dates.format(new Date("03/12/2015"), "MMMM dd, yyyy")).toEqual("March 12, 2015");
    });

    it("should format dates with the format ISO8601", function() {
      expect(Dates.format(new Date(2010, 3, 14, 18, 02, 39, 123), "yyyy-MM-ddTHH:mm:ss.SSSZ")).toEqual("2010-04-14T18:02:39.123Z");
    });

    it("should format dates with the format EEE dd MMM yyyy", function() {
      expect(Dates.format(new Date(2010, 3, 14, 18, 02, 39, 123), "EEE dd MMM yyyy")).toEqual("Wed 14 Apr 2010");
    });

    it("should format dates with the format EEEE dd MMM yyyy", function() {
      expect(Dates.format(new Date(2010, 3, 14, 18, 02, 39, 123), "EEEE dd MMM yyyy")).toEqual("Wednesday 14 Apr 2010");
    });

  });

});
