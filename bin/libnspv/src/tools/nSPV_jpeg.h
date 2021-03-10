
/******************************************************************************
 * Copyright © 2014-2019 The SuperNET Developers.                             *
 *                                                                            *
 * See the AUTHORS, DEVELOPER-AGREEMENT and LICENSE files at                  *
 * the top-level directory of this distribution for the individual copyright  *
 * holder information and the developer policies on copyright and licensing.  *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * SuperNET software, including this file may be copied, modified, propagated *
 * or distributed except according to the terms contained in the LICENSE file *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

#ifndef NSPV_JPEG_H
#define NSPV_JPEG_H

// from https://github.com/owencm/C-Steganography-Framework
#include "jpeg/cdjpeg.h"        /* Common decls for compressing and decompressing jpegs */


int32_t LP_jpg_process(int32_t *recvp,int32_t *capacityp,char *inputfname,char *outputfname,uint8_t *decoded,uint8_t *origdata,int32_t origrequired,int32_t power2,char *password,uint16_t *indp)
{
    struct jpeg_decompress_struct inputinfo;
    struct jpeg_compress_struct outputinfo;
    struct jpeg_error_mgr jerr;
    jvirt_barray_ptr *coef_arrays;
    JDIMENSION i,compnum,rownum,blocknum;
    JBLOCKARRAY coef_buffers[MAX_COMPONENTS];
    JBLOCKARRAY row_ptrs[MAX_COMPONENTS];
    bits256 privkey; FILE *input_file,*output_file; int32_t recvlen,msglen,val,modified,emit,totalrows,limit,required; uint16_t checkind; uint8_t *decrypted,*space,*data=0;
    *recvp = 0;
    if ((input_file = fopen(inputfname, READ_BINARY)) == NULL)
    {
        fprintf(stderr, "Can't open %s\n", inputfname);
        //exit(EXIT_FAILURE);
        return(-1);
    }
    required = origrequired;
    memset(privkey.bytes,0,sizeof(privkey));
    if ( password != 0 && password[0] != 0 )
    {
        if ( required/8 > NSPV_ENCRYPTED_MAXSIZE-60 )
            return(-1);
        data = calloc(1,required/8+512);
        sha256_Raw((uint8_t *)password,(int32_t)strlen(password),privkey.bytes);
        //vcalc_sha256(0,privkey.bytes,(uint8_t *)password,(int32_t)strlen(password));
        if ( origdata != 0 )
        {
            msglen = NSPV_encrypt(*indp,data,origdata,required/8,privkey);
            required = msglen * 8;
            if ( (0) )
            {
                space = calloc(1,NSPV_ENCRYPTED_MAXSIZE);
                if ( (decrypted= NSPV_decrypt(&checkind,&recvlen,space,data,privkey)) == 0 || recvlen != origrequired/8 || checkind != *indp || memcmp(decrypted,origdata,origrequired/8) != 0 )
                    fprintf(stderr,"A decryption error: checkind.%d vs %d, recvlen.%d vs %d, decrypted.%p\n",checkind,*indp,recvlen,origrequired/8,(void *)decrypted);
                else if ( (1) )
                {
                    for (i=0; i<recvlen&&i<16; i++)
                        fprintf(stderr,"%02x",decrypted[i]);
                    fprintf(stderr," VERIFIED decryption.%d ind.%d msglen.%d required.%d\n",recvlen,*indp,msglen,required);
                }
                free(space);
            }
        } else required += 60 * 8;
    }
    else
    {
        data = origdata;
        for (i=0; i<required/8+1; i++)
            fprintf(stderr,"%02x",data[i]);
        fprintf(stderr," origdata.[%d]\n",required);
    }
    if ( power2 < 0 || power2 > 30 )
        power2 = 7;
    limit = 1;
    while ( power2 > 0 )
    {
        limit <<= 1;
        power2--;
    }
    // Initialize the JPEG compression and decompression objects with default error handling
    inputinfo.err = jpeg_std_error(&jerr);
    jpeg_create_decompress(&inputinfo);
    // Specify data source for decompression and recompression
    jpeg_stdio_src(&inputinfo, input_file);
    (void) jpeg_read_header(&inputinfo, TRUE);
    for (compnum=0; compnum<inputinfo.num_components; compnum++)
        coef_buffers[compnum] = ((&inputinfo)->mem->alloc_barray)((j_common_ptr)&inputinfo,JPOOL_IMAGE,inputinfo.comp_info[compnum].width_in_blocks,inputinfo.comp_info[compnum].height_in_blocks);
    coef_arrays = jpeg_read_coefficients(&inputinfo);
    // Copy DCT coeffs to a new array
    int num_components = inputinfo.num_components;
    size_t *block_row_size;//[num_components];
    int *width_in_blocks;//[num_components];
    int *height_in_blocks;//[num_components];
    block_row_size = calloc(sizeof(*block_row_size),num_components);
    width_in_blocks = calloc(sizeof(*width_in_blocks),num_components);
    height_in_blocks = calloc(sizeof(*height_in_blocks),num_components);
    *capacityp = modified = emit = totalrows = 0;
    if ( decoded != 0 )
        memset(decoded,0,required/8+1);
    for (compnum=0; compnum<num_components; compnum++)
    {
        height_in_blocks[compnum] = inputinfo.comp_info[compnum].height_in_blocks;
        width_in_blocks[compnum] = inputinfo.comp_info[compnum].width_in_blocks;
        block_row_size[compnum] = (size_t) SIZEOF(JCOEF)*DCTSIZE2*width_in_blocks[compnum];
        for (rownum=0; rownum<height_in_blocks[compnum]; rownum++)
        {
            row_ptrs[compnum] = ((&inputinfo)->mem->access_virt_barray)((j_common_ptr)&inputinfo,coef_arrays[compnum],rownum,(JDIMENSION)1,FALSE);
            for (blocknum=0; blocknum<width_in_blocks[compnum]; blocknum++)
            {
                for (i=0; i<DCTSIZE2; i++)
                {
                    val = row_ptrs[compnum][0][blocknum][i];
                    if ( val < -limit || val >= limit )
                    {
                        if ( (*capacityp) < required )
                        {
                            if ( (val & 1) != 0 )
                                SETBIT(decoded,(*capacityp));
                            //fprintf(stderr,"%c",(val&1)!=0?'1':'0');
                        }
                        (*capacityp)++;
                    }
                    coef_buffers[compnum][rownum][blocknum][i] = val;
                }
            }
        }
    }
    if ( password != 0 && password[0] != 0 )
    {
        space = calloc(1,NSPV_ENCRYPTED_MAXSIZE);
        if ( (decrypted= NSPV_decrypt(indp,&recvlen,space,decoded,privkey)) != 0 && recvlen == origrequired/8 )
        {
            *recvp = recvlen;
            for (i=0; i<recvlen; i++)
            {
                //if ( i < 64 )
                //    fprintf(stderr,"%02x",decrypted[i]);
                decoded[i] = decrypted[i];
            }
            //fprintf(stderr," decrypted.%d ind.%d required.%d capacity.%d\n",recvlen,*indp,required,*capacityp);
        }
        free(space);
    }
    //fprintf(stderr," capacity %d required.%d power2.%d limit.%d\n",*capacityp,required,power2,limit);
    if ( *capacityp > required && outputfname != 0 && outputfname[0] != 0 )
    {
        if ((output_file = fopen(outputfname, WRITE_BINARY)) == NULL) {
            fprintf(stderr, "Can't open %s\n", outputfname);
            if ( data != origdata )
                free(data);
            return(-1);
        }
        outputinfo.err = jpeg_std_error(&jerr);
        jpeg_create_compress(&outputinfo);
        jpeg_stdio_dest(&outputinfo, output_file);
        jpeg_copy_critical_parameters(&inputinfo,&outputinfo);
        // Print out or modify DCT coefficients
        for (compnum=0; compnum<num_components; compnum++)
        {
            for (rownum=0; rownum<height_in_blocks[compnum]; rownum++)
            {
                for (blocknum=0; blocknum<width_in_blocks[compnum]; blocknum++)
                {
                    //fprintf(stderr,"\n\nComponent: %i, Row:%i, Column: %i\n", compnum, rownum, blocknum);
                    for (i=0; i<DCTSIZE2&&emit<required; i++)
                    {
                        val = coef_buffers[compnum][rownum][blocknum][i];
                        if ( val < -limit || val >= limit )
                        {
                            val &= ~1;
                            if ( GETBIT(data,emit) != 0 )//|| (emit >= required && (rand() & 1) != 0) )
                                val |= 1;
                            //fprintf(stderr,"%c",(val&1)!=0?'1':'0');
                            coef_buffers[compnum][rownum][blocknum][i] = val;
                            emit++;
                        }
                        //fprintf(stderr,"%i,", coef_buffers[compnum][rownum][blocknum][i]);
                    }
                }
            }
        }
        //fprintf(stderr," emit.%d\n",emit);
        // Output the new DCT coeffs to a JPEG file
        modified = 0;
        for (compnum=0; compnum<num_components; compnum++)
        {
            for (rownum=0; rownum<height_in_blocks[compnum]; rownum++)
            {
                row_ptrs[compnum] = ((&outputinfo)->mem->access_virt_barray)((j_common_ptr)&outputinfo,coef_arrays[compnum],rownum,(JDIMENSION)1,TRUE);
                if ( memcmp(row_ptrs[compnum][0][0],coef_buffers[compnum][rownum][0],block_row_size[compnum]) != 0 )
                {
                    memcpy(row_ptrs[compnum][0][0],coef_buffers[compnum][rownum][0],block_row_size[compnum]);
                    modified++;
                }
                totalrows++;
            }
        }
        // Write to the output file
        jpeg_write_coefficients(&outputinfo, coef_arrays);
        // Finish compression and release memory
        jpeg_finish_compress(&outputinfo);
        jpeg_destroy_compress(&outputinfo);
        fclose(output_file);
    }
    jpeg_finish_decompress(&inputinfo);
    jpeg_destroy_decompress(&inputinfo);
    fclose(input_file);
    if ( modified != 0 )
    {
        //fprintf(stderr,"New DCT coefficients successfully written to %s, capacity %d modifiedrows.%d/%d emit.%d\n",outputfname,*capacityp,modified,totalrows,emit);
    }
    free(block_row_size);
    free(width_in_blocks);
    free(height_in_blocks);
    if ( data != origdata )
        free(data);
    return(modified);
}

char *LP_jpg(char *srcfile,char *destfile,int32_t power2,char *passphrase,char *datastr,int32_t required,uint16_t *indp)
{
    cJSON *retjson; int32_t len=0,modified,num,capacity; char *decodedstr; uint8_t *data=0,*decoded=0;
    if ( srcfile != 0 && srcfile[0] != 0 )
    {
        retjson = cJSON_CreateObject();
        if ( datastr != 0 && datastr[0] != 0 )
        {
            if ( (len= is_hexstr(datastr,0)) > 0 )
            {
                len >>= 1;
                data = calloc(1,len);
                decode_hex(data,len,datastr);
                //required = len * 8;
                //int32_t i; for (i=0; i<required; i++)
                //    fprintf(stderr,"%c",'0'+(GETBIT(data,i)!=0));
                //fprintf(stderr," datastr.%d %s\n",required,datastr);
            }
        }
        if ( data == 0 )
            data = calloc(1,required/8+1);
        decoded = calloc(1,len+required);
        if ( (modified= LP_jpg_process(&num,&capacity,srcfile,destfile,decoded,data,required,power2,passphrase,indp)) < 0 )
            jaddstr(retjson,"error","file not found");
        else
        {
            jaddstr(retjson,"result","success");
            jaddnum(retjson,"modifiedrows",modified);
            if ( modified != 0 )
                jaddstr(retjson,"outputfile",destfile);
            jaddnum(retjson,"power2",power2);
            jaddnum(retjson,"capacity",capacity);
            jaddnum(retjson,"required",required);
            jaddnum(retjson,"ind",*indp);
        }
        if ( decoded != 0 )
        {
            if ( capacity > 0 )
            {
//fprintf(stderr,"len.%d required.%d capacity.%d\n",len,required,capacity);
                decodedstr = calloc(1,(len+required)*2+1);
                init_hexbytes_noT(decodedstr,decoded,required/8);
                jaddstr(retjson,"decoded",decodedstr);
                free(decodedstr);
            }
            free(decoded);
        }
        if ( data != 0 )
            free(data);
        return(jprint(retjson,1));
    } else return(clonestr("{\"error\":\"no source file error\"}"));
}

#endif // NSPV_JPEG_H
