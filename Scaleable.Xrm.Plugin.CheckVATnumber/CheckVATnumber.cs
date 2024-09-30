using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Scaleable.Xrm.Plugin.CheckVATnumber
{
    public class CheckVATnumber : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context =
               (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

            IOrganizationServiceFactory factory =
                (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));

            ITracingService tracingService =
                (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            var vatid = context.InputParameters["VatNumber"];
            tracingService.Trace("VAT ID is => " + vatid);
            string countrycode = (string)context.InputParameters["VatCountryISO"];
            tracingService.Trace("Country Code is = > " + countrycode);
            var wc = new WebClient();
            var request = @"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:urn=""urn:ec.europa.eu:taxud:vies:services:checkVat:types"">
                            <soapenv:Header/>
                            <soapenv:Body>
                              <urn:checkVat>
                                 <urn:countryCode>COUNTRY</urn:countryCode>
                                 <urn:vatNumber>" + vatid + @"</urn:vatNumber>
                              </urn:checkVat>
                            </soapenv:Body>
                            </soapenv:Envelope>";
            tracingService.Trace("Soap Request Complete");
            request = request.Replace("COUNTRY", countrycode);
            string response;
            try
            {
                tracingService.Trace("Soap Request is => " + request);
                tracingService.Trace("Executing Request");
                response = wc.UploadString("http://ec.europa.eu/taxation_customs/vies/services/checkVatService", request);
                var isValid = response.Contains("<valid>true</valid>");
                tracingService.Trace("Response is => " + isValid);
                context.OutputParameters["VATResponse"] = isValid;
                var date = DateTime.Now.ToString("MM/dd/yyyy");
                context.OutputParameters["ResponseDate"] = date;
                tracingService.Trace("Response is => " + context.OutputParameters["ResponseDate"].ToString());
            }
            catch
            {
                // service throws WebException e.g. when non-EU VAT is supplied
            }
        }
    }
}
