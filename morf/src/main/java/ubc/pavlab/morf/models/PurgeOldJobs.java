package ubc.pavlab.morf.models;

import java.util.Iterator;
import java.util.Map;

public class PurgeOldJobs implements Runnable {

    // Saved jobs are considered old after this many milliseconds
    private final long purgeAfter;

    private Map<String, Job> savedJobs;

    public PurgeOldJobs( Map<String, Job> savedJobs, long purgeAfter ) {
        this.savedJobs = savedJobs;
        this.purgeAfter = purgeAfter;
    }

    @Override
    public void run() {
        synchronized ( savedJobs ) {

            for ( Iterator<Map.Entry<String, Job>> it = savedJobs.entrySet().iterator(); it.hasNext(); ) {
                Map.Entry<String, Job> entry = it.next();
                Job job = entry.getValue();
                if ( System.currentTimeMillis() - job.getSavedDate() > purgeAfter ) {
                    job.setSavedKey( null );
                    job.setSaved( false );
                    job.setSavedDate( null );
                    it.remove();
                }
            }
        }
    }

}
