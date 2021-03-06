/**
 * 
 */
package ubc.pavlab.morf.beans;

import java.io.Serializable;

import javax.faces.context.FacesContext;
import javax.faces.view.ViewScoped;
import javax.inject.Inject;
import javax.inject.Named;


import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.primefaces.context.RequestContext;
import org.primefaces.model.chart.LineChartModel;

import com.google.gson.Gson;

import ubc.pavlab.morf.models.Chart;
import ubc.pavlab.morf.models.Job;

@Named
@ViewScoped
public class SavedJobView implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 7286831685089743671L;

    private static final Logger log = LogManager.getLogger( SavedJobView.class );

    @Inject
    private JobManager jobManager;

    private String key;

    private Job savedJob;

    private LineChartModel chart;
    private boolean chartReady = false;

    public SavedJobView() {
        log.info( "SavedJobView created" );
    }

    public void init() {
        if ( FacesContext.getCurrentInstance().getPartialViewContext().isAjaxRequest() ) {
            return; // Skip ajax requests.
        }
        log.info( "SavedJobView init" );
        savedJob = jobManager.fetchSavedJob( key, false );
    }

    public void createChart() {

        Chart chart = new Chart( savedJob );

        chartReady = chart.isReady();

        RequestContext.getCurrentInstance()
                .addCallbackParam( "hc_values", new Gson().toJson( chart.getSeriesValues() ) );
        RequestContext.getCurrentInstance()
                .addCallbackParam( "hc_labels", new Gson().toJson( chart.getSeriesLabels() ) );
        RequestContext.getCurrentInstance().addCallbackParam( "hc_names", new Gson().toJson( chart.getSeriesNames() ) );
        RequestContext.getCurrentInstance().addCallbackParam( "hc_title", chart.getName() );

    }

    public void renewSaveJob() {
        jobManager.renewSaveJob( savedJob );
    }

    public Job getSavedJob() {
        return savedJob;
    }

    public void setSavedJob( Job savedJob ) {
        this.savedJob = savedJob;
    }

    public String getKey() {
        return key;
    }

    public void setKey( String key ) {
        this.key = key;
    }

    public boolean isChartReady() {
        return chartReady;
    }

    public LineChartModel getChart() {
        return chart;
    }

}
