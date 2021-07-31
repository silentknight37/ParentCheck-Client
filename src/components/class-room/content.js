import React from 'react';
import 'react-vertical-timeline-component/style.min.css';
import Assignment from './assignment';
const ContentType = {
    Text: 1,
    Video: 2,
    Audio: 3,
    Document: 4,
    Image: 5
}

class Content extends React.Component {

    getDocuments = (contentDocument) => {
        return (
            <div className="col-4" >
                <a href={contentDocument.url} rel="noopener noreferrer" target="_blank">{contentDocument.fileName}</a>
            </div>
        );
    }


    getContentImages = (contentDocument) => {

        return (
            <img className="col-6" src={contentDocument.url} alt={contentDocument.fileName} />
        );
    }

    getContentAudios = (contentDocument) => {
        return (
            <audio style={{ width: "100%" }} controls controlsList="nodownload" preload="none">
                <source src={contentDocument.url} type="audio/ogg" />
                Your browser does not support the audio element.
            </audio>
        );
    }

    getContentVideos = (contentDocument) => {
        return (
            <video style={{ width: "100%" }} controls controlsList="nodownload" preload="none">
                <source src={contentDocument.url} type="audio/ogg" />
                Your browser does not support the audio element.
            </video>
        );
    }

    getResorce = (type, url, documents) => {
        switch (type) {
            case ContentType.Document:
                return (
                    documents.map(i => this.getDocuments(i))
                );
            case ContentType.Image:
                return (
                    <div className="row">
                        {documents.map(i => this.getContentImages(i))}
                    </div>
                );
            case ContentType.Video:
                return (
                    documents.map(i => this.getContentVideos(i))
                );
            case ContentType.Audio:
                return (
                    documents.map(i => this.getContentAudios(i))
                )
            default:
                return "";
        }

    }
    generateContent = (content) => {
        return (
            <div>
                <p>
                    {content.description}
                </p>
                <br />
                {this.getResorce(content.typeId, content.url, content.documents)}
                <br />
            </div>
        )
    }

    getAssignment = () => {
        return this.props.isAssignmentAssign===true && this.props.assignment!=null && (
            <div>
                <hr />
                <Assignment title={this.props.topic} assignment={this.props.assignment}/>
            </div>
        )
    }

    render() {
        return (
            <div className="blog-single">

                <section className="comment-box">
                    <h4>{this.props.topic}</h4>
                    <hr />
                    {this.props.contents.map(i => this.generateContent(i))}
                </section>
                {this.getAssignment()}
            </div>
        );
    }
};

export default Content;